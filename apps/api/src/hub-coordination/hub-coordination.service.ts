import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  HubCoordinationAssignmentPayload,
  HubCoordinationAssignmentResponse,
  HubCoordinationResponse,
} from '@fosholhaat/types';

const HUB_COORDINATION_OVERVIEW: HubCoordinationResponse = {
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
    {
      id: 'hub-alert-02',
      label: 'Sorting line 2 blocked',
      severity: 'high',
    },
  ],
};

const HUB_LANE_KEYS = ['inbound', 'sorting', 'dispatch', 'exceptions'] as const;

@Injectable()
export class HubCoordinationService {
  getOverview(): HubCoordinationResponse {
    return HUB_COORDINATION_OVERVIEW;
  }

  assignLane(
    payload: HubCoordinationAssignmentPayload,
  ): HubCoordinationAssignmentResponse {
    if (!HUB_LANE_KEYS.includes(payload.laneKey)) {
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
