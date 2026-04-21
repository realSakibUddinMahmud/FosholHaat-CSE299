import { Module } from '@nestjs/common';
import { BuyerDiscoveryController } from './buyer-discovery.controller';
import { BuyerDiscoveryService } from './buyer-discovery.service';

@Module({
  controllers: [BuyerDiscoveryController],
  providers: [BuyerDiscoveryService],
})
export class BuyerDiscoveryModule {}
