import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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
  async getBuyerCart(): Promise<BuyerCartResponse> {
    return this.buyerCartCheckoutService.getBuyerCart();
  }

  @Patch('cart/items/:lineId')
  async updateBuyerCartLine(
    @Param('lineId') lineId: string,
    @Body() body: BuyerCartMutationPayload = {},
  ): Promise<BuyerCartResponse> {
    return this.buyerCartCheckoutService.updateBuyerCartLine(lineId, body);
  }

  @Post('checkout/fulfillment')
  async setCheckoutFulfillment(
    @Body() body: BuyerFulfillmentDetails = {} as BuyerFulfillmentDetails,
  ): Promise<BuyerFulfillmentResponse> {
    return this.buyerCartCheckoutService.setCheckoutFulfillment(body);
  }

  @Post('checkout/payment')
  async setCheckoutPayment(
    @Body() body: BuyerPaymentDetails = {} as BuyerPaymentDetails,
  ): Promise<BuyerPaymentResponse> {
    return this.buyerCartCheckoutService.setCheckoutPayment(body);
  }

  @Post('checkout/submit')
  async submitCheckout(): Promise<BuyerCheckoutSubmitResponse> {
    return this.buyerCartCheckoutService.submitCheckout();
  }
}
