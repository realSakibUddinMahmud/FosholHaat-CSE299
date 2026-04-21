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
  private readonly inboundReceipts: InboundReceiptDetail[] =
    structuredClone(inboundReceiptSeed);

  getInboundQueue(): InboundReceiptQueueResponse {
    const summary = this.inboundReceipts.reduce<
      InboundReceiptQueueResponse['summary']
    >(
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
      featuredReceiptId: this.inboundReceipts[0].id,
      receipts: this.inboundReceipts.map((receipt) => this.toSummary(receipt)),
    };
  }

  getInboundReceipt(receiptId: string): InboundReceiptDetailResponse {
    return { receipt: this.findReceipt(receiptId) };
  }

  receiveInboundReceipt(
    receiptId: string,
    request: ReceiveReceiptPayload = {},
  ): InboundReceiptMutationResponse {
    const receipt = this.findReceipt(receiptId);
    this.assertPending(receipt);

    const receivedAt = new Date().toISOString();
    receipt.status = InboundReceiptStatus.RECEIVED;
    receipt.receivedAt = receivedAt;
    receipt.receiverName = request.receiverName?.trim() || 'Hub receiver';
    receipt.actualGradeLabel = receipt.expectedGradeLabel;
    receipt.discrepancy = null;
    receipt.nextStepLabel = 'Move to sorting intake.';

    return {
      receipt,
      feedbackMessage: 'Receipt confirmed.',
    };
  }

  reportInboundReceiptDiscrepancy(
    receiptId: string,
    request: ReportDiscrepancyPayload,
  ): InboundReceiptMutationResponse {
    const receipt = this.findReceipt(receiptId);
    this.assertPending(receipt);
    this.assertDiscrepancyPayload(receiptId, request);

    const reportedAt = new Date().toISOString();
    receipt.status = InboundReceiptStatus.DISCREPANCY;
    receipt.receivedAt = reportedAt;
    receipt.receiverName = 'Hub receiver';
    receipt.actualGradeLabel = receipt.expectedGradeLabel;
    receipt.discrepancy = {
      reportedAt,
      actualQuantity: request.actualQuantity,
      notes: request.notes.trim(),
    };
    receipt.nextStepLabel = 'Hold for discrepancy review.';

    return {
      receipt,
      feedbackMessage: 'Discrepancy logged.',
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
