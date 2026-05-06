import { Controller, Get, Header, Headers, Param, Post } from '@nestjs/common';
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
  async getSellerOrders(
    @Headers('authorization') authorization?: string,
  ): Promise<SellerOrderQueueResponse> {
    return this.sellerOrdersService.getSellerOrders(authorization);
  }

  @Get(':orderId')
  async getSellerOrder(
    @Headers('authorization') authorization: string | undefined,
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderDetailResponse> {
    return this.sellerOrdersService.getSellerOrder(authorization, orderId);
  }

  @Get(':orderId/handoff-label')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async getHandoffLabel(
    @Headers('authorization') authorization: string | undefined,
    @Param('orderId') orderId: string,
  ): Promise<string> {
    return this.sellerOrdersService.getHandoffLabel(authorization, orderId);
  }

  @Get(':orderId/handoff-qr.svg')
  @Header('Content-Type', 'image/svg+xml')
  async getHandoffQr(
    @Headers('authorization') authorization: string | undefined,
    @Param('orderId') orderId: string,
  ): Promise<string> {
    return this.sellerOrdersService.getHandoffQr(authorization, orderId);
  }

  @Post(':orderId/accept')
  async acceptSellerOrder(
    @Headers('authorization') authorization: string | undefined,
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    return this.sellerOrdersService.acceptSellerOrder(authorization, orderId);
  }

  @Post(':orderId/pack')
  async packSellerOrder(
    @Headers('authorization') authorization: string | undefined,
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    return this.sellerOrdersService.packSellerOrder(authorization, orderId);
  }

  @Post(':orderId/print-label')
  async printHandoffLabel(
    @Headers('authorization') authorization: string | undefined,
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    return this.sellerOrdersService.printHandoffLabel(authorization, orderId);
  }

  @Post(':orderId/ready')
  async readySellerOrder(
    @Headers('authorization') authorization: string | undefined,
    @Param('orderId') orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    return this.sellerOrdersService.readySellerOrder(authorization, orderId);
  }
}
