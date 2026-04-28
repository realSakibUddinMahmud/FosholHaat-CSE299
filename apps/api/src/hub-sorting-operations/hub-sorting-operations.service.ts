/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  SortingBatchDetail,
  SortingBatchDetailResponse,
  SortingBatchErrorResponse,
  SortingBatchHoldPayload,
  SortingBatchMutationResponse,
  SortingBatchSummary,
  SortingBatchTransitionPayload,
  SortingQueueResponse,
} from '@fosholhaat/types';
import { SORTING_HOLD_REASONS, SortingBatchStatus } from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

const hubSortingBatchSeed: SortingBatchDetail[] = [
  {
    batchId: 'SB-3401',
    commodityLabel: 'Potato mix',
    expectedQuantityLabel: '120 sacks',
    laneLabel: 'Sorting lane 1',
    status: SortingBatchStatus.READY,
    nextActionLabel: 'Start sorting batch.',
    updatedAtLabel: '5m ago',
    receiverLabel: 'Unassigned',
    itemGroups: [
      { label: 'Grade A', quantityLabel: '70 sacks' },
      { label: 'Grade B', quantityLabel: '50 sacks' },
    ],
    holdRecord: null,
  },
  {
    batchId: 'SB-3402',
    commodityLabel: 'Onion mix',
    expectedQuantityLabel: '84 bags',
    laneLabel: 'Sorting lane 2',
    status: SortingBatchStatus.READY,
    nextActionLabel: 'Start sorting batch.',
    updatedAtLabel: '8m ago',
    receiverLabel: 'Unassigned',
    itemGroups: [
      { label: 'Premium', quantityLabel: '40 bags' },
      { label: 'Standard', quantityLabel: '44 bags' },
    ],
    holdRecord: null,
  },
  {
    batchId: 'SB-3403',
    commodityLabel: 'Vegetable crates',
    expectedQuantityLabel: '64 crates',
    laneLabel: 'Sorting lane 3',
    status: SortingBatchStatus.IN_PROGRESS,
    nextActionLabel: 'Review mix and count.',
    updatedAtLabel: 'Just now',
    receiverLabel: 'Sorting lead',
    itemGroups: [
      { label: 'Leafy', quantityLabel: '22 crates' },
      { label: 'Root', quantityLabel: '42 crates' },
    ],
    holdRecord: null,
  },
  {
    batchId: 'SB-3404',
    commodityLabel: 'Vegetable crates',
    expectedQuantityLabel: '58 crates',
    laneLabel: 'Sorting lane 4',
    status: SortingBatchStatus.HOLD,
    nextActionLabel: 'Resolve hold and recheck batch.',
    updatedAtLabel: '12m ago',
    receiverLabel: 'Shift lead',
    itemGroups: [
      { label: 'Leafy', quantityLabel: '28 crates' },
      { label: 'Root', quantityLabel: '30 crates' },
    ],
    holdRecord: {
      reason: 'count-mismatch',
      reasonLabel: 'Count mismatch',
      note: 'Gate scan and physical count differ by 2 crates.',
      reportedAt: '2026-04-21T02:30:00.000Z',
    },
  },
  {
    batchId: 'SB-3405',
    commodityLabel: 'Potato mix',
    expectedQuantityLabel: '96 sacks',
    laneLabel: 'Sorting lane 5',
    status: SortingBatchStatus.COMPLETE,
    nextActionLabel: 'Move to dispatch intake.',
    updatedAtLabel: '18m ago',
    receiverLabel: 'Sorting lead',
    itemGroups: [
      { label: 'Grade A', quantityLabel: '60 sacks' },
      { label: 'Grade B', quantityLabel: '36 sacks' },
    ],
    holdRecord: null,
  },
];

@Injectable()
export class HubSortingOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly hubSortingBatches: SortingBatchDetail[] =
    structuredClone(hubSortingBatchSeed);

  async getSortingQueue(): Promise<SortingQueueResponse> {
    const batches = await this.prisma.sortingBatch.findMany({
      include: {
        inboundReceipt: {
          include: { supplyLot: { include: { product: true } } },
        },
        assignedTo: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    const mapped = batches.map((batch) => this.fromDbBatch(batch));
    const summary = mapped.reduce<SortingQueueResponse['summary']>(
      (accumulator, batch) => {
        accumulator[batch.status] += 1;
        accumulator.total += 1;
        return accumulator;
      },
      {
        READY: 0,
        IN_PROGRESS: 0,
        HOLD: 0,
        COMPLETE: 0,
        total: 0,
      },
    );

    return {
      summary,
      activeTab: SortingBatchStatus.READY,
      featuredBatchId: mapped[0]?.batchId ?? '',
      batches: mapped.map((batch) => this.toSummary(batch)),
    };
  }

  async getSortingBatch(batchId: string): Promise<SortingBatchDetailResponse> {
    return { batch: this.fromDbBatch(await this.getDbBatch(batchId)) };
  }

  async startSortingBatch(
    batchId: string,
    request: SortingBatchTransitionPayload = {},
  ): Promise<SortingBatchMutationResponse> {
    const current = this.fromDbBatch(await this.getDbBatch(batchId));
    this.assertTransition(current, SortingBatchStatus.READY, 'start');
    const batch = await this.prisma.sortingBatch.update({
      where: { id: batchId },
      data: {
        status: SortingBatchStatus.IN_PROGRESS,
        notes: request.operatorName?.trim()
          ? `Operator: ${request.operatorName.trim()}`
          : 'Sorting started.',
      },
      include: this.batchInclude(),
    });

    return {
      batch: this.fromDbBatch(batch),
      feedbackMessage: 'Batch started.',
    };
  }

  async holdSortingBatch(
    batchId: string,
    request: SortingBatchHoldPayload,
  ): Promise<SortingBatchMutationResponse> {
    const current = this.fromDbBatch(await this.getDbBatch(batchId));
    this.assertTransition(current, SortingBatchStatus.IN_PROGRESS, 'hold');
    this.assertHoldPayload(batchId, request);
    const batch = await this.prisma.sortingBatch.update({
      where: { id: batchId },
      data: {
        status: SortingBatchStatus.HOLD,
        notes: `${request.reason}: ${request.note.trim()}`,
      },
      include: this.batchInclude(),
    });

    return {
      batch: this.fromDbBatch(batch),
      feedbackMessage: 'Batch moved to hold.',
    };
  }

  async completeSortingBatch(
    batchId: string,
    request: SortingBatchTransitionPayload = {},
  ): Promise<SortingBatchMutationResponse> {
    const current = this.fromDbBatch(await this.getDbBatch(batchId));
    this.assertTransition(
      current,
      [SortingBatchStatus.IN_PROGRESS, SortingBatchStatus.HOLD],
      'complete',
    );
    const batch = await this.prisma.sortingBatch.update({
      where: { id: batchId },
      data: {
        status: SortingBatchStatus.COMPLETE,
        notes: request.operatorName?.trim()
          ? `Completed by ${request.operatorName.trim()}`
          : 'Sorting complete.',
      },
      include: this.batchInclude(),
    });
    await this.prisma.supplyLot.update({
      where: { id: batch.inboundReceipt.supplyLotId },
      data: { status: 'SORTED' },
    });

    return {
      batch: this.fromDbBatch(batch),
      feedbackMessage: 'Batch completed.',
    };
  }

  private batchInclude() {
    return {
      inboundReceipt: {
        include: { supplyLot: { include: { product: true } } },
      },
      assignedTo: true,
    };
  }

  private async getDbBatch(batchId: string) {
    const batch = await this.prisma.sortingBatch.findUnique({
      where: { id: batchId },
      include: this.batchInclude(),
    });
    if (!batch) {
      throw new NotFoundException(
        this.createError('BATCH_NOT_FOUND', batchId, 'Batch not found'),
      );
    }
    return batch;
  }

  private fromDbBatch(batch: any): SortingBatchDetail {
    const holdMatch = /^([^:]+):\s*(.+)$/.exec(batch.notes);
    const holdReason = holdMatch?.[1];
    return {
      batchId: batch.id,
      commodityLabel: batch.inboundReceipt.supplyLot.product.name,
      expectedQuantityLabel: `${batch.quantity} ${batch.inboundReceipt.supplyLot.unit}`,
      laneLabel: batch.laneLabel,
      status: batch.status,
      nextActionLabel:
        batch.status === SortingBatchStatus.READY
          ? 'Start sorting batch.'
          : batch.status === SortingBatchStatus.IN_PROGRESS
            ? 'Review mix and count.'
            : batch.status === SortingBatchStatus.HOLD
              ? 'Resolve hold and recheck batch.'
              : 'Move to dispatch intake.',
      updatedAtLabel: batch.updatedAt.toISOString(),
      receiverLabel: batch.assignedTo?.fullName ?? 'Unassigned',
      itemGroups: [
        {
          label: batch.inboundReceipt.supplyLot.gradeLabel,
          quantityLabel: `${batch.quantity} ${batch.inboundReceipt.supplyLot.unit}`,
        },
      ],
      holdRecord:
        batch.status === SortingBatchStatus.HOLD &&
        holdReason &&
        SORTING_HOLD_REASONS.includes(holdReason as any)
          ? {
              reason: holdReason as any,
              reasonLabel: this.toHoldReasonLabel(holdReason as any),
              note: holdMatch?.[2] ?? batch.notes,
              reportedAt: batch.updatedAt.toISOString(),
            }
          : null,
    };
  }

  private findBatch(batchId: string): SortingBatchDetail {
    const batch = this.hubSortingBatches.find(
      (item) => item.batchId === batchId,
    );
    if (!batch) {
      throw new NotFoundException(
        this.createError('BATCH_NOT_FOUND', batchId, 'Batch not found'),
      );
    }
    return batch;
  }

  private toSummary(batch: SortingBatchDetail): SortingBatchSummary {
    return {
      batchId: batch.batchId,
      commodityLabel: batch.commodityLabel,
      expectedQuantityLabel: batch.expectedQuantityLabel,
      laneLabel: batch.laneLabel,
      status: batch.status,
      nextActionLabel: batch.nextActionLabel,
      updatedAtLabel: batch.updatedAtLabel,
    };
  }

  private assertTransition(
    batch: SortingBatchDetail,
    allowedStatuses: SortingBatchStatus | SortingBatchStatus[],
    action: 'start' | 'hold' | 'complete',
  ): void {
    const allowed = Array.isArray(allowedStatuses)
      ? allowedStatuses
      : [allowedStatuses];

    if (allowed.includes(batch.status)) {
      return;
    }

    throw new ConflictException(
      this.createError(
        'INVALID_BATCH_TRANSITION',
        batch.batchId,
        `Batch cannot ${action} from ${batch.status.toLowerCase()}.`,
      ),
    );
  }

  private assertHoldPayload(
    batchId: string,
    request: SortingBatchHoldPayload,
  ): void {
    if (
      request?.reason &&
      SORTING_HOLD_REASONS.includes(request.reason) &&
      request.note?.trim()
    ) {
      return;
    }

    throw new BadRequestException(
      this.createError(
        'MISSING_HOLD_REASON',
        batchId,
        'Hold reason and note are required.',
      ),
    );
  }

  private toHoldReasonLabel(reason: SortingBatchHoldPayload['reason']): string {
    return {
      'quality-check': 'Quality check',
      'count-mismatch': 'Count mismatch',
      'label-review': 'Label review',
    }[reason];
  }

  private createError(
    code: SortingBatchErrorResponse['error']['code'],
    batchId: string,
    message: string,
  ): SortingBatchErrorResponse {
    return {
      error: {
        code,
        message,
        batchId,
      },
    };
  }
}
