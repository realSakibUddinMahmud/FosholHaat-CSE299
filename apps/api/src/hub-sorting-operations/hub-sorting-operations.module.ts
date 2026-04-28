import { Module } from '@nestjs/common';
import { HubSortingOperationsController } from './hub-sorting-operations.controller';
import { HubSortingOperationsService } from './hub-sorting-operations.service';

@Module({
  controllers: [HubSortingOperationsController],
  providers: [HubSortingOperationsService],
})
export class HubSortingOperationsModule {}
