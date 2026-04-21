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
  getOrders(): BuyerOrderSummary[] {
    return this.buyerOrdersService.getOrders();
  }

  @Get(':id')
  getOrderDetail(@Param('id') id: string): BuyerOrderDetail {
    return this.buyerOrdersService.getOrderDetail(id);
  }

  @Get(':id/tracking')
  getOrderTracking(@Param('id') id: string): BuyerOrderTrackingResponse {
    return this.buyerOrdersService.getOrderTracking(id);
  }
}
