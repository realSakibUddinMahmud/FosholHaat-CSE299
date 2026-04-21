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
  getSortingQueue(): SortingQueueResponse {
    return this.hubSortingOperationsService.getSortingQueue();
  }

  @Get(':batchId')
  getSortingBatch(
    @Param('batchId') batchId: string,
  ): SortingBatchDetailResponse {
    return this.hubSortingOperationsService.getSortingBatch(batchId);
  }

  @Post(':batchId/start')
  startSortingBatch(
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchTransitionPayload = {},
  ): SortingBatchMutationResponse {
    return this.hubSortingOperationsService.startSortingBatch(batchId, body);
  }

  @Post(':batchId/hold')
  holdSortingBatch(
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchHoldPayload,
  ): SortingBatchMutationResponse {
    return this.hubSortingOperationsService.holdSortingBatch(batchId, body);
  }

  @Post(':batchId/complete')
  completeSortingBatch(
    @Param('batchId') batchId: string,
    @Body() body: SortingBatchTransitionPayload = {},
  ): SortingBatchMutationResponse {
    return this.hubSortingOperationsService.completeSortingBatch(batchId, body);
  }
}
