import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import type {
  HubCoordinationAssignmentPayload,
  HubCoordinationAssignmentResponse,
  HubCoordinationResponse,
  HubReceiveHandoffPayload,
  HubReceiveHandoffResponse,
} from '@fosholhaat/types';
import { HubCoordinationService } from './hub-coordination.service';

@Controller('hub/coordination')
export class HubCoordinationController {
  constructor(
    private readonly hubCoordinationService: HubCoordinationService,
  ) {}

  @Get()
  async getOverview(
    @Headers('authorization') authorization?: string,
  ): Promise<HubCoordinationResponse> {
    return this.hubCoordinationService.getOverview(authorization);
  }

  @Post('assignments')
  async assignLane(
    @Headers('authorization') authorization: string | undefined,
    @Body() payload: HubCoordinationAssignmentPayload,
  ): Promise<HubCoordinationAssignmentResponse> {
    return this.hubCoordinationService.assignLane(authorization, payload);
  }

  @Post('handoffs/receive')
  async receiveHandoff(
    @Headers('authorization') authorization: string | undefined,
    @Body() payload: HubReceiveHandoffPayload,
  ): Promise<HubReceiveHandoffResponse> {
    return this.hubCoordinationService.receiveHandoff(authorization, payload);
  }
}
