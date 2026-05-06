import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type {
  BuyerCartMutationPayload,
  BuyerCartResponse,
  BuyerCheckoutSubmitResponse,
  BuyerFulfillmentDetails,
  BuyerFulfillmentResponse,
  BuyerPaymentDetails,
  BuyerPaymentResponse,
} from '@fosholhaat/types';
import { BuyerCartCheckoutService } from './buyer-cart-checkout.service';

@Controller('buyer')
export class BuyerCartCheckoutController {
  constructor(
    private readonly buyerCartCheckoutService: BuyerCartCheckoutService,
  ) {}

  @Get('cart')
  async getBuyerCart(
    @Headers('authorization') authorization?: string,
  ): Promise<BuyerCartResponse> {
    return this.buyerCartCheckoutService.getBuyerCart(authorization);
  }

  @Post('cart/items')
  async addBuyerCartLine(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: BuyerCartMutationPayload & { supplyLotId?: string } = {},
  ): Promise<BuyerCartResponse> {
    return this.buyerCartCheckoutService.addBuyerCartLine(
      authorization,
      body.supplyLotId ?? '',
      body,
    );
  }

  @Patch('cart/items/:lineId')
  async updateBuyerCartLine(
    @Headers('authorization') authorization: string | undefined,
    @Param('lineId') lineId: string,
    @Body() body: BuyerCartMutationPayload = {},
  ): Promise<BuyerCartResponse> {
    return this.buyerCartCheckoutService.updateBuyerCartLine(
      authorization,
      lineId,
      body,
    );
  }

  @Post('checkout/fulfillment')
  async setCheckoutFulfillment(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: BuyerFulfillmentDetails = {} as BuyerFulfillmentDetails,
  ): Promise<BuyerFulfillmentResponse> {
    return this.buyerCartCheckoutService.setCheckoutFulfillment(
      authorization,
      body,
    );
  }

  @Post('checkout/payment')
  async setCheckoutPayment(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: BuyerPaymentDetails = {} as BuyerPaymentDetails,
  ): Promise<BuyerPaymentResponse> {
    return this.buyerCartCheckoutService.setCheckoutPayment(
      authorization,
      body,
    );
  }

  @Post('checkout/submit')
  async submitCheckout(
    @Headers('authorization') authorization?: string,
  ): Promise<BuyerCheckoutSubmitResponse> {
    return this.buyerCartCheckoutService.submitCheckout(authorization);
  }
}
