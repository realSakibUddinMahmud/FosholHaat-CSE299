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
  getExceptions(): HubExceptionListResponse {
    return this.hubExceptionManagementService.getExceptions();
  }

  @Get(':exceptionId')
  getException(
    @Param('exceptionId') exceptionId: string,
  ): HubExceptionDetailResponse {
    return this.hubExceptionManagementService.getException(exceptionId);
  }

  @Post(':exceptionId/resolve')
  resolveException(
    @Param('exceptionId') exceptionId: string,
    @Body() body: HubExceptionMutationRequest = {},
  ): HubExceptionMutationResponse {
    return this.hubExceptionManagementService.resolveException(
      exceptionId,
      body,
    );
  }

  @Post(':exceptionId/escalate')
  escalateException(
    @Param('exceptionId') exceptionId: string,
    @Body() body: HubExceptionMutationRequest = {},
  ): HubExceptionMutationResponse {
    return this.hubExceptionManagementService.escalateException(
      exceptionId,
      body,
    );
  }
}
