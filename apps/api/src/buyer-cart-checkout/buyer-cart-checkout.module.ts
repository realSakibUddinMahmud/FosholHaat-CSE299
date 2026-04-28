import { Module } from '@nestjs/common';
import { BuyerCartCheckoutController } from './buyer-cart-checkout.controller';
import { BuyerCartCheckoutService } from './buyer-cart-checkout.service';

@Module({
  controllers: [BuyerCartCheckoutController],
  providers: [BuyerCartCheckoutService],
})
export class BuyerCartCheckoutModule {}
