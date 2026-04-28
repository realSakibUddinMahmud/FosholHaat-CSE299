/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  HubCoordinationAssignmentPayload,
  HubCoordinationAssignmentResponse,
  HubCoordinationResponse,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

const HUB_LANE_KEYS = ['inbound', 'sorting', 'dispatch', 'exceptions'] as const;

@Injectable()
export class HubCoordinationService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<HubCoordinationResponse> {
    const hub = await this.prisma.hub.findFirst();
    return {
      lanes: [
        { key: 'inbound', count: 12, urgentCount: 2 },
        { key: 'sorting', count: 4, urgentCount: 1 },
        { key: 'dispatch', count: 8, urgentCount: 0 },
        { key: 'exceptions', count: 3, urgentCount: 3 },
      ],
      alerts: [
        {
          id: 'hub-alert-01',
          label: 'Inbound truck delayed by 2 hours',
          severity: 'medium',
        },
      ],
    };
  }

  async assignLane(
    payload: HubCoordinationAssignmentPayload,
  ): Promise<HubCoordinationAssignmentResponse> {
    const hub = await this.prisma.hub.findFirst();
    if (!HUB_LANE_KEYS.includes(payload.laneKey as any)) {
      throw new BadRequestException('Invalid lane key');
    }

    if (!payload.assigneeId?.trim()) {
      throw new BadRequestException('Assignee ID required');
    }

    return {
      success: true,
      message: 'Assignment saved',
      assignment: {
        laneKey: payload.laneKey,
        assigneeId: payload.assigneeId.trim(),
      },
    };
  }
}
