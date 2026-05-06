import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  HubDispatchDetailResponse,
  HubDispatchErrorResponse,
  HubDispatchMutationResponse,
  HubDispatchQueueResponse,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentHubManager } from '../auth/current-user';

@Injectable()
export class HubDispatchOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDispatchQueue(
    authorization?: string,
  ): Promise<HubDispatchQueueResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    return {
      summary: { staging: 0, ready: 0, departed: 0, total: 0 },
      loads: [],
      featuredLoadId: '',
      activeTab: 'staging',
    };
  }

  async getDispatchLoad(
    authorization: string | undefined,
    loadId: string,
  ): Promise<HubDispatchDetailResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    throw new NotFoundException(
      this.createError('LOAD_NOT_FOUND', loadId, 'Load not found'),
    );
  }

  async assignDispatchLoad(
    authorization: string | undefined,
    loadId: string,
  ): Promise<HubDispatchMutationResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    throw new NotFoundException(
      this.createError('LOAD_NOT_FOUND', loadId, 'Load not found'),
    );
  }

  async markDispatchLoadDispatched(
    authorization: string | undefined,
    loadId: string,
  ): Promise<HubDispatchMutationResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    throw new NotFoundException(
      this.createError('LOAD_NOT_FOUND', loadId, 'Load not found'),
    );
  }

  private createError(
    code: HubDispatchErrorResponse['error']['code'],
    loadId: string,
    message: string,
  ): HubDispatchErrorResponse {
    return { error: { code, message, loadId } };
  }
}
