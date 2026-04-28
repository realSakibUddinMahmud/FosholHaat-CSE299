import { Module } from '@nestjs/common';
import { HubExceptionManagementController } from './hub-exception-management.controller';
import { HubExceptionManagementService } from './hub-exception-management.service';

@Module({
  controllers: [HubExceptionManagementController],
  providers: [HubExceptionManagementService],
})
export class HubExceptionManagementModule {}
