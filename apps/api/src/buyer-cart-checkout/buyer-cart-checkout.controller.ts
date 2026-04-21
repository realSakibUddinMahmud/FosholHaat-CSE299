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
  getBuyerCart(): BuyerCartResponse {
    return this.buyerCartCheckoutService.getBuyerCart();
  }

  @Patch('cart/items/:lineId')
  updateBuyerCartLine(
    @Param('lineId') lineId: string,
    @Body() body: BuyerCartMutationPayload = {},
  ): BuyerCartResponse {
    return this.buyerCartCheckoutService.updateBuyerCartLine(lineId, body);
  }

  @Post('checkout/fulfillment')
  setCheckoutFulfillment(
    @Body() body: BuyerFulfillmentDetails = {} as BuyerFulfillmentDetails,
  ): BuyerFulfillmentResponse {
    return this.buyerCartCheckoutService.setCheckoutFulfillment(body);
  }

  @Post('checkout/payment')
  setCheckoutPayment(
    @Body() body: BuyerPaymentDetails = {} as BuyerPaymentDetails,
  ): BuyerPaymentResponse {
    return this.buyerCartCheckoutService.setCheckoutPayment(body);
  }

  @Post('checkout/submit')
  submitCheckout(): BuyerCheckoutSubmitResponse {
    return this.buyerCartCheckoutService.submitCheckout();
  }
}
