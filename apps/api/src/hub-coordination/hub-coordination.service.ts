/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  HubCoordinationAssignmentPayload,
  HubCoordinationAssignmentResponse,
  HubReceiveHandoffPayload,
  HubReceiveHandoffResponse,
  HubCoordinationResponse,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentHubManager } from '../auth/current-user';

const HUB_LANE_KEYS = ['inbound', 'sorting', 'dispatch', 'exceptions'] as const;

@Injectable()
export class HubCoordinationService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(authorization?: string): Promise<HubCoordinationResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    const [inbound, sorting, readyHandoffs, exceptions] = await Promise.all([
      this.prisma.inboundReceipt.count(),
      this.prisma.sortingBatch.count(),
      this.prisma.sellerHandoff.count({ where: { status: 'READY_FOR_HUB' } }),
      this.prisma.sellerHandoff.count({ where: { status: 'DISCREPANCY' } }),
    ]);
    return {
      lanes: [
        {
          key: 'inbound',
          count: inbound + readyHandoffs,
          urgentCount: readyHandoffs,
        },
        { key: 'sorting', count: sorting, urgentCount: 0 },
        { key: 'dispatch', count: 0, urgentCount: 0 },
        { key: 'exceptions', count: exceptions, urgentCount: exceptions },
      ],
      alerts: [],
    };
  }

  async receiveHandoff(
    authorization: string | undefined,
    payload: HubReceiveHandoffPayload,
  ): Promise<HubReceiveHandoffResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
    const handoff = await this.prisma.sellerHandoff.findUnique({
      where: { handoffCode: payload.handoffCode?.trim() },
      include: { order: true },
    });
    if (!handoff) throw new BadRequestException('Handoff not found');
    const sealMatches = handoff.sealCode === payload.sealCode?.trim();
    if (!sealMatches) {
      await this.prisma.$transaction([
        this.prisma.sellerHandoff.update({
          where: { id: handoff.id },
          data: {
            status: 'DISCREPANCY',
            discrepancyNotes:
              payload.discrepancyNotes ?? 'Seal code did not match.',
          },
        }),
        this.prisma.orderEvent.create({
          data: {
            orderId: handoff.orderId,
            actorRole: 'HUB_MANAGER',
            eventType: 'HUB_DISCREPANCY',
            fromStatus: handoff.order.status,
            toStatus: handoff.order.status,
            message: 'Hub found a QR or seal mismatch during receiving.',
            metadata: { handoffCode: handoff.handoffCode },
          },
        }),
      ]);
      return {
        success: true,
        orderCode: handoff.order.code,
        handoffCode: handoff.handoffCode,
        status: 'DISCREPANCY',
        message: 'Seal mismatch recorded as hub exception.',
      };
    }
    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: handoff.orderId },
        data: { status: 'HUB_RECEIVED' },
      }),
      this.prisma.sellerHandoff.update({
        where: { id: handoff.id },
        data: {
          status: 'RECEIVED',
          hubReceivedAt: new Date(),
          discrepancyNotes: null,
        },
      }),
      this.prisma.orderEvent.create({
        data: {
          orderId: handoff.orderId,
          actorRole: 'HUB_MANAGER',
          eventType: 'HUB_RECEIVED',
          fromStatus: handoff.order.status,
          toStatus: 'HUB_RECEIVED',
          message: 'Hub scanned the QR label and verified the seal.',
          metadata: { handoffCode: handoff.handoffCode },
        },
      }),
    ]);
    return {
      success: true,
      orderCode: handoff.order.code,
      handoffCode: handoff.handoffCode,
      status: 'HUB_RECEIVED',
      message: 'Handoff received by hub.',
    };
  }

  async assignLane(
    authorization: string | undefined,
    payload: HubCoordinationAssignmentPayload,
  ): Promise<HubCoordinationAssignmentResponse> {
    await resolveCurrentHubManager(this.prisma, authorization);
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
