import { Controller, Get, Param } from '@nestjs/common';
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
  async getOrders(): Promise<BuyerOrderSummary[]> {
    return this.buyerOrdersService.getOrders();
  }

  @Get(':id')
  async getOrderDetail(@Param('id') id: string): Promise<BuyerOrderDetail> {
    return this.buyerOrdersService.getOrderDetail(id);
  }

  @Get(':id/tracking')
  async getOrderTracking(
    @Param('id') id: string,
  ): Promise<BuyerOrderTrackingResponse> {
    return this.buyerOrdersService.getOrderTracking(id);
  }
}
