import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import type {
  SortingBatchDetailResponse,
  SortingBatchHoldPayload,
  SortingBatchMutationResponse,
  SortingBatchTransitionPayload,
  SortingQueueResponse,
} from '@fosholhaat/types';
import { HubSortingOperationsService } from './hub-sorting-operations.service';

@Controller('hub/sorting')
export class HubSortingOperationsController {
  constructor(
    private readonly hubSortingOperationsService: HubSortingOperationsService,
  ) {}

  @Get()
  async getSortingQueue(
    @Headers('authorization') authorization?: string,
  ): Promise<SortingQueueResponse> {
    return this.hubSortingOperationsService.getSortingQueue(authorization);
  }

  @Get(':batchId')
  async getSortingBatch(
    @Headers('authorization') authorization: string | undefined,
    @Param('batchId') batchId: string,
  ): Promise<SortingBatchDetailResponse> {
    return this.hubSortingOperationsService.getSortingBatch(
      authorization,
      batchId,
    );
  }

  @Post(':batchId/start')
  async startSortingBatch(
    @Headers('authorization') authorization: string | undefined,
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchTransitionPayload = {},
  ): Promise<SortingBatchMutationResponse> {
    return this.hubSortingOperationsService.startSortingBatch(
      authorization,
      batchId,
      body,
    );
  }

  @Post(':batchId/hold')
  async holdSortingBatch(
    @Headers('authorization') authorization: string | undefined,
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchHoldPayload,
  ): Promise<SortingBatchMutationResponse> {
    return this.hubSortingOperationsService.holdSortingBatch(
      authorization,
      batchId,
      body,
    );
  }

  @Post(':batchId/complete')
  async completeSortingBatch(
    @Headers('authorization') authorization: string | undefined,
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchTransitionPayload = {},
  ): Promise<SortingBatchMutationResponse> {
    return this.hubSortingOperationsService.completeSortingBatch(
      authorization,
      batchId,
      body,
    );
  }
}
