import { Module } from '@nestjs/common';
import { SellerSupplyOperationsController } from './seller-supply-operations.controller';
import { SellerSupplyOperationsService } from './seller-supply-operations.service';

@Module({
  controllers: [SellerSupplyOperationsController],
  providers: [SellerSupplyOperationsService],
})
export class SellerSupplyOperationsModule {}
