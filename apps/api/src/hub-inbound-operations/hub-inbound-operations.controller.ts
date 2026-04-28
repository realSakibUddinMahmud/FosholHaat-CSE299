import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type {
  InboundReceiptDetailResponse,
  InboundReceiptMutationResponse,
  InboundReceiptQueueResponse,
  ReceiveReceiptPayload,
  ReportDiscrepancyPayload,
} from '@fosholhaat/types';
import { HubInboundOperationsService } from './hub-inbound-operations.service';

@Controller('hub/inbound')
export class HubInboundOperationsController {
  constructor(
    private readonly hubInboundOperationsService: HubInboundOperationsService,
  ) {}

  @Get()
  async getInboundQueue(): Promise<InboundReceiptQueueResponse> {
    return this.hubInboundOperationsService.getInboundQueue();
  }

  @Get(':receiptId')
  async getInboundReceipt(
    @Param('receiptId') receiptId: string,
  ): Promise<InboundReceiptDetailResponse> {
    return this.hubInboundOperationsService.getInboundReceipt(receiptId);
  }

  @Post(':receiptId/receive')
  async receiveInboundReceipt(
    @Param('receiptId') receiptId: string,
    @Body() body: ReceiveReceiptPayload = {},
  ): Promise<InboundReceiptMutationResponse> {
    return this.hubInboundOperationsService.receiveInboundReceipt(
      receiptId,
      body,
    );
  }

  @Post(':receiptId/discrepancies')
  async reportInboundReceiptDiscrepancy(
    @Param('receiptId') receiptId: string,
    @Body() body: ReportDiscrepancyPayload,
  ): Promise<InboundReceiptMutationResponse> {
    return this.hubInboundOperationsService.reportInboundReceiptDiscrepancy(
      receiptId,
      body,
    );
  }
}
