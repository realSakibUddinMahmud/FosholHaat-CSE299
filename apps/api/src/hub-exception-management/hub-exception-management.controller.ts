import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
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
  async getExceptions(
    @Headers('authorization') authorization?: string,
  ): Promise<HubExceptionListResponse> {
    return this.hubExceptionManagementService.getExceptions(authorization);
  }

  @Get(':exceptionId')
  async getException(
    @Headers('authorization') authorization: string | undefined,
    @Param('exceptionId') exceptionId: string,
  ): Promise<HubExceptionDetailResponse> {
    return this.hubExceptionManagementService.getException(
      authorization,
      exceptionId,
    );
  }

  @Post(':exceptionId/resolve')
  async resolveException(
    @Headers('authorization') authorization: string | undefined,
    @Param('exceptionId') exceptionId: string,
    @Body() body: HubExceptionMutationRequest = {},
  ): Promise<HubExceptionMutationResponse> {
    return this.hubExceptionManagementService.resolveException(
      authorization,
      exceptionId,
      body,
    );
  }

  @Post(':exceptionId/escalate')
  async escalateException(
    @Headers('authorization') authorization: string | undefined,
    @Param('exceptionId') exceptionId: string,
    @Body() body: HubExceptionMutationRequest = {},
  ): Promise<HubExceptionMutationResponse> {
    return this.hubExceptionManagementService.escalateException(
      authorization,
      exceptionId,
      body,
    );
  }
}
