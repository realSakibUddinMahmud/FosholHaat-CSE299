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
  async getOverview(): Promise<HubCoordinationResponse> {
    return this.hubCoordinationService.getOverview();
  }

  @Post('assignments')
  async assignLane(
    @Body() payload: HubCoordinationAssignmentPayload,
  ): Promise<HubCoordinationAssignmentResponse> {
    return this.hubCoordinationService.assignLane(payload);
  }
}
