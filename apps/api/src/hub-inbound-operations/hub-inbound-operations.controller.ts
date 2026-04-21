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
  getInboundQueue(): InboundReceiptQueueResponse {
    return this.hubInboundOperationsService.getInboundQueue();
  }

  @Get(':receiptId')
  getInboundReceipt(
    @Param('receiptId') receiptId: string,
  ): InboundReceiptDetailResponse {
    return this.hubInboundOperationsService.getInboundReceipt(receiptId);
  }

  @Post(':receiptId/receive')
  receiveInboundReceipt(
    @Param('receiptId') receiptId: string,
    @Body() body: ReceiveReceiptPayload = {},
  ): InboundReceiptMutationResponse {
    return this.hubInboundOperationsService.receiveInboundReceipt(
      receiptId,
      body,
    );
  }

  @Post(':receiptId/discrepancies')
  reportInboundReceiptDiscrepancy(
    @Param('receiptId') receiptId: string,
    @Body() body: ReportDiscrepancyPayload,
  ): InboundReceiptMutationResponse {
    return this.hubInboundOperationsService.reportInboundReceiptDiscrepancy(
      receiptId,
      body,
    );
  }
}
