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
import { resolveCurrentHubManager } from '../auth/current-user';

@Injectable()
export class HubInboundOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getInboundQueue(
    authorization?: string,
  ): Promise<InboundReceiptQueueResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
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
    authorization: string | undefined,
    receiptId: string,
  ): Promise<InboundReceiptDetailResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    const receipt = await this.getDbReceipt(receiptId);
    return { receipt: this.fromDbReceipt(receipt) };
  }

  async receiveInboundReceipt(
    authorization: string | undefined,
    receiptId: string,
    request: ReceiveReceiptPayload = {},
  ): Promise<InboundReceiptMutationResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
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
    authorization: string | undefined,
    receiptId: string,
    request: ReportDiscrepancyPayload,
  ): Promise<InboundReceiptMutationResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
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
