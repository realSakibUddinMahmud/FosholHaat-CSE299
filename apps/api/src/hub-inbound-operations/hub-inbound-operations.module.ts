import { Module } from '@nestjs/common';
import { HubInboundOperationsController } from './hub-inbound-operations.controller';
import { HubInboundOperationsService } from './hub-inbound-operations.service';

@Module({
  controllers: [HubInboundOperationsController],
  providers: [HubInboundOperationsService],
})
export class HubInboundOperationsModule {}
