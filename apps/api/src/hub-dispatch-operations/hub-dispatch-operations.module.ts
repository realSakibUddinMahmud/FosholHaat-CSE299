import { Module } from '@nestjs/common';
import { HubDispatchOperationsController } from './hub-dispatch-operations.controller';
import { HubDispatchOperationsService } from './hub-dispatch-operations.service';

@Module({
  controllers: [HubDispatchOperationsController],
  providers: [HubDispatchOperationsService],
})
export class HubDispatchOperationsModule {}
