import { Body, Controller, Get, Post } from '@nestjs/common';
import type {
  HubCoordinationAssignmentPayload,
  HubCoordinationAssignmentResponse,
  HubCoordinationResponse,
} from '@fosholhaat/types';
import { HubCoordinationService } from './hub-coordination.service';

@Controller('hub/coordination')
export class HubCoordinationController {
  constructor(
    private readonly hubCoordinationService: HubCoordinationService,
  ) {}

  @Get()
  getOverview(): HubCoordinationResponse {
    return this.hubCoordinationService.getOverview();
  }

  @Post('assignments')
  assignLane(
    @Body() payload: HubCoordinationAssignmentPayload,
  ): HubCoordinationAssignmentResponse {
    return this.hubCoordinationService.assignLane(payload);
  }
}
