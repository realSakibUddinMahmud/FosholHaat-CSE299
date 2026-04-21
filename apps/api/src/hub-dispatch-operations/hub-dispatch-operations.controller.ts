import { Controller, Get, Param, Post } from '@nestjs/common';
import { HubDispatchOperationsService } from './hub-dispatch-operations.service';

@Controller('hub/dispatch')
export class HubDispatchOperationsController {
  constructor(
    private readonly hubDispatchOperationsService: HubDispatchOperationsService,
  ) {}

  @Get()
  getDispatchQueue() {
    return this.hubDispatchOperationsService.getDispatchQueue();
  }

  @Get(':loadId')
  getDispatchLoad(@Param('loadId') loadId: string) {
    return this.hubDispatchOperationsService.getDispatchLoad(loadId);
  }

  @Post(':loadId/assign')
  assignDispatchLoad(@Param('loadId') loadId: string) {
    return this.hubDispatchOperationsService.assignDispatchLoad(loadId);
  }

  @Post(':loadId/dispatched')
  markDispatchLoadDispatched(@Param('loadId') loadId: string) {
    return this.hubDispatchOperationsService.markDispatchLoadDispatched(loadId);
  }
}
