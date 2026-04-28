import { Controller, Get, Param, Post } from '@nestjs/common';
import { HubDispatchOperationsService } from './hub-dispatch-operations.service';
import type {
  HubDispatchDetailResponse,
  HubDispatchMutationResponse,
  HubDispatchQueueResponse,
} from '@fosholhaat/types';

@Controller('hub/dispatch')
export class HubDispatchOperationsController {
  constructor(
    private readonly hubDispatchOperationsService: HubDispatchOperationsService,
  ) {}

  @Get()
  async getDispatchQueue(): Promise<HubDispatchQueueResponse> {
    return this.hubDispatchOperationsService.getDispatchQueue();
  }

  @Get(':loadId')
  async getDispatchLoad(
    @Param('loadId') loadId: string,
  ): Promise<HubDispatchDetailResponse> {
    return this.hubDispatchOperationsService.getDispatchLoad(loadId);
  }

  @Post(':loadId/assign')
  async assignDispatchLoad(
    @Param('loadId') loadId: string,
  ): Promise<HubDispatchMutationResponse> {
    return this.hubDispatchOperationsService.assignDispatchLoad(loadId);
  }

  @Post(':loadId/dispatched')
  async markDispatchLoadDispatched(
    @Param('loadId') loadId: string,
  ): Promise<HubDispatchMutationResponse> {
    return this.hubDispatchOperationsService.markDispatchLoadDispatched(loadId);
  }
}
