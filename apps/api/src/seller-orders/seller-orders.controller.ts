import { Controller, Get, Param, Post } from '@nestjs/common';
import type {
  SellerOrderDetailResponse,
  SellerOrderMutationResponse,
  SellerOrderQueueResponse,
} from '@fosholhaat/types';
import { SellerOrdersService } from './seller-orders.service';

@Controller('seller/orders')
export class SellerOrdersController {
  constructor(private readonly sellerOrdersService: SellerOrdersService) {}

  @Get()
  async getSellerOrders(): Promise<SellerOrderQueueResponse> {
    return this.sellerOrdersService.getSellerOrders();
  }

  @Get(':orderId')
  async getSellerOrder(
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderDetailResponse> {
    return this.sellerOrdersService.getSellerOrder(orderId);
  }

  @Post(':orderId/accept')
  async acceptSellerOrder(
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    return this.sellerOrdersService.acceptSellerOrder(orderId);
  }

  @Post(':orderId/pack')
  async packSellerOrder(
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    return this.sellerOrdersService.packSellerOrder(orderId);
  }

  @Post(':orderId/ready')
  async readySellerOrder(
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    return this.sellerOrdersService.readySellerOrder(orderId);
  }
}
