import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  HubExceptionDetailResponse,
  HubExceptionErrorResponse,
  HubExceptionListResponse,
  HubExceptionMutationRequest,
  HubExceptionMutationResponse,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentHubManager } from '../auth/current-user';

@Injectable()
export class HubExceptionManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getExceptions(
    authorization?: string,
  ): Promise<HubExceptionListResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    return {
      summary: { active: 0, 'waiting-review': 0, resolved: 0, total: 0 },
      featuredExceptionId: '',
      activeTab: 'active',
      exceptions: [],
    };
  }

  async getException(
    authorization: string | undefined,
    exceptionId: string,
  ): Promise<HubExceptionDetailResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    throw new NotFoundException(
      this.createError(
        'EXCEPTION_NOT_FOUND',
        exceptionId,
        'Exception not found',
      ),
    );
  }

  async resolveException(
    authorization: string | undefined,
    exceptionId: string,
    _request: HubExceptionMutationRequest = {},
  ): Promise<HubExceptionMutationResponse> {
    void _request;
    await resolveCurrentHubManager(this.prisma, authorization);
    throw new NotFoundException(
      this.createError(
        'EXCEPTION_NOT_FOUND',
        exceptionId,
        'Exception not found',
      ),
    );
  }

  async escalateException(
    authorization: string | undefined,
    exceptionId: string,
    _request: HubExceptionMutationRequest = {},
  ): Promise<HubExceptionMutationResponse> {
    void _request;
    await resolveCurrentHubManager(this.prisma, authorization);
    throw new NotFoundException(
      this.createError(
        'EXCEPTION_NOT_FOUND',
        exceptionId,
        'Exception not found',
      ),
    );
  }

  private createError(
    code: HubExceptionErrorResponse['error']['code'],
    exceptionId: string,
    message: string,
  ): HubExceptionErrorResponse {
    return { error: { code, message, exceptionId } };
  }
}
