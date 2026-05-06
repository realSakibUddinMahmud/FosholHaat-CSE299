import { Controller, Get, Headers, Param } from '@nestjs/common';
import { BuyerOrdersService } from './buyer-orders.service';
import {
  BuyerOrderSummary,
  BuyerOrderDetail,
  BuyerOrderTrackingResponse,
} from '@fosholhaat/types';

@Controller('buyer/orders')
export class BuyerOrdersController {
  constructor(private readonly buyerOrdersService: BuyerOrdersService) {}

  @Get()
  async getOrders(
    @Headers('authorization') authorization?: string,
  ): Promise<BuyerOrderSummary[]> {
    return this.buyerOrdersService.getOrders(authorization);
  }

  @Get(':id')
  async getOrderDetail(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') id: string,
  ): Promise<BuyerOrderDetail> {
    return this.buyerOrdersService.getOrderDetail(authorization, id);
  }

  @Get(':id/tracking')
  async getOrderTracking(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') id: string,
  ): Promise<BuyerOrderTrackingResponse> {
    return this.buyerOrdersService.getOrderTracking(authorization, id);
  }
}
