import { Module } from '@nestjs/common';
import { BuyerGroupBuyController } from './buyer-group-buy.controller';
import { BuyerGroupBuyService } from './buyer-group-buy.service';

@Module({
  controllers: [BuyerGroupBuyController],
  providers: [BuyerGroupBuyService],
})
export class BuyerGroupBuyModule {}
