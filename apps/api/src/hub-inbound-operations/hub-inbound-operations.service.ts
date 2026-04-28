/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  InboundReceiptDetail,
  InboundReceiptErrorResponse,
  InboundReceiptDetailResponse,
  InboundReceiptMutationResponse,
  InboundReceiptQueueResponse,
  InboundReceiptSummary,
  ReceiveReceiptPayload,
  ReportDiscrepancyPayload,
} from '@fosholhaat/types';
import { InboundReceiptStatus } from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

const inboundReceiptSeed: InboundReceiptDetail[] = [
  {
    id: 'IR-9101',
    supplierName: 'Bogra Fresh Supply',
    commodity: 'Potato',
    expectedQuantity: 120,
    unit: 'kg',
    status: InboundReceiptStatus.PENDING,
    arrivalDate: '2026-04-21T03:30:00.000Z',
    arrivalWindowLabel: '08:00 - 09:00',
    laneLabel: 'Inbound Bay 1',
    note: 'Primary receipt for morning intake.',
    receivedAt: null,
    expectedGradeLabel: 'Grade A',
    actualGradeLabel: null,
    receiverName: null,
    discrepancy: null,
    nextStepLabel: 'Confirm receipt before sorting.',
  },
  {
    id: 'IR-9102',
    supplierName: 'North Agro Market',
    commodity: 'Onion',
    expectedQuantity: 84,
    unit: 'bags',
    status: InboundReceiptStatus.PENDING,
    arrivalDate: '2026-04-21T04:10:00.000Z',
    arrivalWindowLabel: '09:00 - 10:00',
    laneLabel: 'Inbound Bay 2',
    note: 'Awaiting dock scan.',
    receivedAt: null,
    expectedGradeLabel: 'Grade A',
    actualGradeLabel: null,
    receiverName: null,
    discrepancy: null,
    nextStepLabel: 'Capture receipt details.',
  },
  {
    id: 'IR-9103',
    supplierName: 'Dhaka Valley Produce',
    commodity: 'Vegetables',
    expectedQuantity: 64,
    unit: 'crates',
    status: InboundReceiptStatus.RECEIVED,
    arrivalDate: '2026-04-21T02:50:00.000Z',
    arrivalWindowLabel: '07:00 - 08:00',
    laneLabel: 'Inbound Bay 3',
    note: 'Confirmed at gate.',
    receivedAt: '2026-04-21T03:05:00.000Z',
    expectedGradeLabel: 'Grade B',
    actualGradeLabel: 'Grade B',
    receiverName: 'Hub receiver',
    discrepancy: null,
    nextStepLabel: 'Move to sorting intake.',
  },
  {
    id: 'IR-9104',
    supplierName: 'Shibganj Cooperative',
    commodity: 'Potato',
    expectedQuantity: 96,
    unit: 'kg',
    status: InboundReceiptStatus.DISCREPANCY,
    arrivalDate: '2026-04-21T01:35:00.000Z',
    arrivalWindowLabel: '06:00 - 07:00',
    laneLabel: 'Inbound Bay 4',
    note: 'Quantity mismatch already logged.',
    receivedAt: '2026-04-21T01:50:00.000Z',
    expectedGradeLabel: 'Grade A',
    actualGradeLabel: 'Grade A',
    receiverName: 'Shift lead',
    discrepancy: {
      reportedAt: '2026-04-21T01:50:00.000Z',
      actualQuantity: 88,
      notes: '8 kg short at gate scan.',
    },
    nextStepLabel: 'Hold for discrepancy review.',
  },
];

@Injectable()
export class HubInboundOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly inboundReceipts: InboundReceiptDetail[] =
    structuredClone(inboundReceiptSeed);

  async getInboundQueue(): Promise<InboundReceiptQueueResponse> {
    const receipts = await this.prisma.inboundReceipt.findMany({
      include: {
        supplyLot: { include: { product: true, business: true, seller: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const mapped = receipts.map((receipt) => this.fromDbReceipt(receipt));
    const summary = mapped.reduce<InboundReceiptQueueResponse['summary']>(
      (accumulator, receipt) => {
        accumulator[receipt.status] += 1;
        accumulator.total += 1;
        return accumulator;
      },
      { PENDING: 0, RECEIVED: 0, DISCREPANCY: 0, total: 0 },
    );

    return {
      summary,
      activeTab: InboundReceiptStatus.PENDING,
      featuredReceiptId: mapped[0]?.id ?? '',
      receipts: mapped.map((receipt) => this.toSummary(receipt)),
    };
  }

  async getInboundReceipt(
    receiptId: string,
  ): Promise<InboundReceiptDetailResponse> {
    const receipt = await this.getDbReceipt(receiptId);
    return { receipt: this.fromDbReceipt(receipt) };
  }

  async receiveInboundReceipt(
    receiptId: string,
    request: ReceiveReceiptPayload = {},
  ): Promise<InboundReceiptMutationResponse> {
    const current = this.fromDbReceipt(await this.getDbReceipt(receiptId));
    this.assertPending(current);
    const receipt = await this.prisma.inboundReceipt.update({
      where: { id: receiptId },
      data: {
        status: InboundReceiptStatus.RECEIVED,
        actualQty: current.expectedQuantity,
        discrepancyNotes: null,
        notes: request.receiverName?.trim()
          ? `${current.note} Receiver: ${request.receiverName.trim()}`
          : current.note,
      },
      include: {
        supplyLot: { include: { product: true, business: true, seller: true } },
        receiver: true,
      },
    });
    await this.prisma.supplyLot.update({
      where: { id: receipt.supplyLotId },
      data: { status: 'RECEIVED' },
    });

    return {
      receipt: this.fromDbReceipt(receipt),
      feedbackMessage: 'Receipt confirmed.',
    };
  }

  async reportInboundReceiptDiscrepancy(
    receiptId: string,
    request: ReportDiscrepancyPayload,
  ): Promise<InboundReceiptMutationResponse> {
    const current = this.fromDbReceipt(await this.getDbReceipt(receiptId));
    this.assertPending(current);
    this.assertDiscrepancyPayload(receiptId, request);
    const receipt = await this.prisma.inboundReceipt.update({
      where: { id: receiptId },
      data: {
        status: InboundReceiptStatus.DISCREPANCY,
        actualQty: request.actualQuantity,
        discrepancyNotes: request.notes.trim(),
      },
      include: {
        supplyLot: { include: { product: true, business: true, seller: true } },
        receiver: true,
      },
    });

    return {
      receipt: this.fromDbReceipt(receipt),
      feedbackMessage: 'Discrepancy logged.',
    };
  }

  private async getDbReceipt(receiptId: string) {
    const receipt = await this.prisma.inboundReceipt.findUnique({
      where: { id: receiptId },
      include: {
        supplyLot: { include: { product: true, business: true, seller: true } },
        receiver: true,
      },
    });
    if (!receipt) {
      throw new NotFoundException(
        this.createError('RECEIPT_NOT_FOUND', receiptId, 'Receipt not found'),
      );
    }
    return receipt;
  }

  private fromDbReceipt(receipt: any): InboundReceiptDetail {
    const supplierName =
      receipt.supplyLot.business?.name || receipt.supplyLot.seller.fullName;
    return {
      id: receipt.id,
      supplierName,
      commodity: receipt.supplyLot.product.name,
      expectedQuantity: receipt.expectedQty,
      unit: receipt.supplyLot.unit,
      status: receipt.status,
      arrivalDate: receipt.createdAt.toISOString(),
      arrivalWindowLabel: 'Today',
      laneLabel: receipt.hub?.name ?? 'Inbound bay',
      note: receipt.notes,
      receivedAt:
        receipt.status === InboundReceiptStatus.PENDING
          ? null
          : receipt.updatedAt.toISOString(),
      expectedGradeLabel: receipt.supplyLot.gradeLabel,
      actualGradeLabel:
        receipt.status === InboundReceiptStatus.PENDING
          ? null
          : receipt.supplyLot.gradeLabel,
      receiverName: receipt.receiver?.fullName ?? null,
      discrepancy: receipt.discrepancyNotes
        ? {
            reportedAt: receipt.updatedAt.toISOString(),
            actualQuantity: receipt.actualQty ?? 0,
            notes: receipt.discrepancyNotes,
          }
        : null,
      nextStepLabel:
        receipt.status === InboundReceiptStatus.RECEIVED
          ? 'Move to sorting intake.'
          : receipt.status === InboundReceiptStatus.DISCREPANCY
            ? 'Hold for discrepancy review.'
            : 'Confirm receipt before sorting.',
    };
  }

  private findReceipt(receiptId: string): InboundReceiptDetail {
    const receipt = this.inboundReceipts.find((item) => item.id === receiptId);
    if (!receipt) {
      throw new NotFoundException(
        this.createError('RECEIPT_NOT_FOUND', receiptId, 'Receipt not found'),
      );
    }
    return receipt;
  }

  private toSummary(receipt: InboundReceiptDetail): InboundReceiptSummary {
    return {
      id: receipt.id,
      supplierName: receipt.supplierName,
      commodity: receipt.commodity,
      expectedQuantity: receipt.expectedQuantity,
      unit: receipt.unit,
      status: receipt.status,
      arrivalDate: receipt.arrivalDate,
      arrivalWindowLabel: receipt.arrivalWindowLabel,
      laneLabel: receipt.laneLabel,
      note: receipt.note,
    };
  }

  private assertPending(receipt: InboundReceiptDetail): void {
    if (receipt.status === InboundReceiptStatus.PENDING) {
      return;
    }

    throw new ConflictException(
      this.createError(
        'DUPLICATE_RECEIVE_TRANSITION',
        receipt.id,
        'Receipt already moved past inbound receive.',
      ),
    );
  }

  private assertDiscrepancyPayload(
    receiptId: string,
    request: ReportDiscrepancyPayload,
  ): void {
    const validQuantity =
      Number.isInteger(request?.actualQuantity) && request.actualQuantity >= 0;
    const notes = request?.notes?.trim();

    if (validQuantity && notes) {
      return;
    }

    throw new BadRequestException(
      this.createError(
        'INVALID_DISCREPANCY_PAYLOAD',
        receiptId,
        'Discrepancy payload is invalid.',
      ),
    );
  }

  private createError(
    code: InboundReceiptErrorResponse['error']['code'],
    receiptId: string,
    message: string,
  ): InboundReceiptErrorResponse {
    return { error: { code, message, receiptId } };
  }
}
