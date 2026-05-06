import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
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
  async getInboundQueue(
    @Headers('authorization') authorization?: string,
  ): Promise<InboundReceiptQueueResponse> {
    return this.hubInboundOperationsService.getInboundQueue(authorization);
  }

  @Get(':receiptId')
  async getInboundReceipt(
    @Headers('authorization') authorization: string | undefined,
    @Param('receiptId') receiptId: string,
  ): Promise<InboundReceiptDetailResponse> {
    return this.hubInboundOperationsService.getInboundReceipt(
      authorization,
      receiptId,
    );
  }

  @Post(':receiptId/receive')
  async receiveInboundReceipt(
    @Headers('authorization') authorization: string | undefined,
    @Param('receiptId') receiptId: string,
    @Body() body: ReceiveReceiptPayload = {},
  ): Promise<InboundReceiptMutationResponse> {
    return this.hubInboundOperationsService.receiveInboundReceipt(
      authorization,
      receiptId,
      body,
    );
  }

  @Post(':receiptId/discrepancies')
  async reportInboundReceiptDiscrepancy(
    @Headers('authorization') authorization: string | undefined,
    @Param('receiptId') receiptId: string,
    @Body() body: ReportDiscrepancyPayload,
  ): Promise<InboundReceiptMutationResponse> {
    return this.hubInboundOperationsService.reportInboundReceiptDiscrepancy(
      authorization,
      receiptId,
      body,
    );
  }
}
