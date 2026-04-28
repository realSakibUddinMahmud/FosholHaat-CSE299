import { Module } from '@nestjs/common';
import { SellerPayoutsController } from './seller-payouts.controller';
import { SellerPayoutsService } from './seller-payouts.service';

@Module({
  controllers: [SellerPayoutsController],
  providers: [SellerPayoutsService],
})
export class SellerPayoutsModule {}
