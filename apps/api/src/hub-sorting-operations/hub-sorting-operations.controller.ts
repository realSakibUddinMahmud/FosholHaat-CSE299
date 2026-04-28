import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  async getSortingQueue(): Promise<SortingQueueResponse> {
    return this.hubSortingOperationsService.getSortingQueue();
  }

  @Get(':batchId')
  async getSortingBatch(
    @Param('batchId') batchId: string,
  ): Promise<SortingBatchDetailResponse> {
    return this.hubSortingOperationsService.getSortingBatch(batchId);
  }

  @Post(':batchId/start')
  async startSortingBatch(
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchTransitionPayload = {},
  ): Promise<SortingBatchMutationResponse> {
    return this.hubSortingOperationsService.startSortingBatch(batchId, body);
  }

  @Post(':batchId/hold')
  async holdSortingBatch(
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchHoldPayload,
  ): Promise<SortingBatchMutationResponse> {
    return this.hubSortingOperationsService.holdSortingBatch(batchId, body);
  }

  @Post(':batchId/complete')
  async completeSortingBatch(
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchTransitionPayload = {},
  ): Promise<SortingBatchMutationResponse> {
    return this.hubSortingOperationsService.completeSortingBatch(batchId, body);
  }
}
