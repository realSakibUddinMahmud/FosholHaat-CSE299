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
  getSellerOrders(): SellerOrderQueueResponse {
    return this.sellerOrdersService.getSellerOrders();
  }

  @Get(':orderId')
  getSellerOrder(@Param('orderId') orderId: string): SellerOrderDetailResponse {
    return this.sellerOrdersService.getSellerOrder(orderId);
  }

  @Post(':orderId/accept')
  acceptSellerOrder(
    @Param('orderId') orderId: string,
  ): SellerOrderMutationResponse {
    return this.sellerOrdersService.acceptSellerOrder(orderId);
  }

  @Post(':orderId/pack')
  packSellerOrder(
    @Param('orderId') orderId: string,
  ): SellerOrderMutationResponse {
    return this.sellerOrdersService.packSellerOrder(orderId);
  }

  @Post(':orderId/ready')
  readySellerOrder(
    @Param('orderId') orderId: string,
  ): SellerOrderMutationResponse {
    return this.sellerOrdersService.readySellerOrder(orderId);
  }
}
