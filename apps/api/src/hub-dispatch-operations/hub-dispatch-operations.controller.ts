import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
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
  async getDispatchQueue(
    @Headers('authorization') authorization?: string,
  ): Promise<HubDispatchQueueResponse> {
    return this.hubDispatchOperationsService.getDispatchQueue(authorization);
  }

  @Get(':loadId')
  async getDispatchLoad(
    @Headers('authorization') authorization: string | undefined,
    @Param('loadId') loadId: string,
  ): Promise<HubDispatchDetailResponse> {
    return this.hubDispatchOperationsService.getDispatchLoad(
      authorization,
      loadId,
    );
  }

  @Post(':loadId/assign')
  async assignDispatchLoad(
    @Headers('authorization') authorization: string | undefined,
    @Param('loadId') loadId: string,
  ): Promise<HubDispatchMutationResponse> {
    return this.hubDispatchOperationsService.assignDispatchLoad(
      authorization,
      loadId,
    );
  }

  @Post(':loadId/dispatched')
  async markDispatchLoadDispatched(
    @Headers('authorization') authorization: string | undefined,
    @Param('loadId') loadId: string,
  ): Promise<HubDispatchMutationResponse> {
    return this.hubDispatchOperationsService.markDispatchLoadDispatched(
      authorization,
      loadId,
    );
  }
}
