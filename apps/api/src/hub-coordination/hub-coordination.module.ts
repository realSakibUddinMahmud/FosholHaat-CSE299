import { Module } from '@nestjs/common';
import { HubCoordinationController } from './hub-coordination.controller';
import { HubCoordinationService } from './hub-coordination.service';

@Module({
  controllers: [HubCoordinationController],
  providers: [HubCoordinationService],
})
export class HubCoordinationModule {}
