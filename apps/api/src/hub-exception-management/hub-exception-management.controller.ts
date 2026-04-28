import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  HubExceptionDetailResponse,
  HubExceptionListResponse,
  HubExceptionMutationRequest,
  HubExceptionMutationResponse,
} from '@fosholhaat/types';
import { HubExceptionManagementService } from './hub-exception-management.service';

@Controller('hub/exceptions')
export class HubExceptionManagementController {
  constructor(
    private readonly hubExceptionManagementService: HubExceptionManagementService,
  ) {}

  @Get()
  async getExceptions(): Promise<HubExceptionListResponse> {
    return this.hubExceptionManagementService.getExceptions();
  }

  @Get(':exceptionId')
  async getException(
    @Param('exceptionId') exceptionId: string,
  ): Promise<HubExceptionDetailResponse> {
    return this.hubExceptionManagementService.getException(exceptionId);
  }

  @Post(':exceptionId/resolve')
  async resolveException(
    @Param('exceptionId') exceptionId: string,
    @Body() body: HubExceptionMutationRequest = {},
  ): Promise<HubExceptionMutationResponse> {
    return this.hubExceptionManagementService.resolveException(
      exceptionId,
      body,
    );
  }

  @Post(':exceptionId/escalate')
  async escalateException(
    @Param('exceptionId') exceptionId: string,
    @Body() body: HubExceptionMutationRequest = {},
  ): Promise<HubExceptionMutationResponse> {
    return this.hubExceptionManagementService.escalateException(
      exceptionId,
      body,
    );
  }
}
