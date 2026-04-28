import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  HubExceptionDetail,
  HubExceptionDetailResponse,
  HubExceptionErrorResponse,
  HubExceptionListResponse,
  HubExceptionMutationRequest,
  HubExceptionMutationResponse,
  HubExceptionSummary,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

const hubExceptionSeed: HubExceptionDetail[] = [
  {
    exceptionId: 'EX-4101',
    statusTab: 'active',
    severity: 'high-priority',
    title: 'Inbound gate scan mismatch',
    lotLabel: 'Lot #LOT-4832',
    laneLabel: 'Warehouse A',
    buyerVisibilityLabel: 'Buyer Visibility: Delayed on Marketplace',
    recommendedActionLabel: 'Update Status',
    createdAgoLabel: '2m ago',
    description:
      'Parcel count at the inbound gate does not match the manifest.',
    sourceLabel: 'Inbound dock 2',
    nextActionLabel: 'Recheck gate scan and update status before release.',
    actionOptions: ['resolve', 'escalate', 'hold'],
    timeline: [
      { id: 'ev-1', label: 'Mismatch detected at gate', timeLabel: '2m ago' },
      { id: 'ev-2', label: 'Hub shift lead notified', timeLabel: '1m ago' },
    ],
  },
  {
    exceptionId: 'EX-4102',
    statusTab: 'active',
    severity: 'critical',
    title: 'Dispatch bag left unassigned',
    lotLabel: 'Lot #LOT-5921',
    laneLabel: 'Processing Hub',
    buyerVisibilityLabel: 'Buyer Visibility: Visible',
    recommendedActionLabel: 'Resolve Discrepancy',
    createdAgoLabel: '15m ago',
    description: 'One staging bag is ready but has no assigned dispatch owner.',
    sourceLabel: 'Dispatch prep desk',
    nextActionLabel: 'Assign owner or escalate to hub manager.',
    actionOptions: ['resolve', 'escalate', 'hold'],
    timeline: [
      { id: 'ev-3', label: 'Bag staged without owner', timeLabel: '15m ago' },
      { id: 'ev-4', label: 'Dispatch lead reminded', timeLabel: '11m ago' },
    ],
  },
  {
    exceptionId: 'EX-4103',
    statusTab: 'waiting-review',
    severity: 'documentation',
    title: 'Missing origin certificate',
    lotLabel: 'Lot #LOT-4890',
    laneLabel: 'Inbound Queue',
    buyerVisibilityLabel: 'Buyer Visibility: Hidden',
    recommendedActionLabel: 'Upload File',
    createdAgoLabel: '1h ago',
    description:
      'Origin certificate is missing and the lot cannot move forward.',
    sourceLabel: 'Inbound queue desk',
    nextActionLabel: 'Upload file or escalate to document control.',
    actionOptions: ['resolve', 'escalate', 'hold'],
    timeline: [
      { id: 'ev-5', label: 'Certificate missing', timeLabel: '1h ago' },
      { id: 'ev-6', label: 'Waiting review started', timeLabel: '48m ago' },
    ],
  },
  {
    exceptionId: 'EX-4104',
    statusTab: 'resolved',
    severity: 'documentation',
    title: 'Coordination reminder closed',
    lotLabel: 'Lot #LOT-2210',
    laneLabel: 'Command Desk',
    buyerVisibilityLabel: 'Buyer Visibility: Visible',
    recommendedActionLabel: 'Resolved',
    createdAgoLabel: '2h ago',
    description: 'Route briefing completed and reminder removed.',
    sourceLabel: 'Hub command desk',
    nextActionLabel: 'No further action required.',
    actionOptions: ['resolve'],
    timeline: [
      { id: 'ev-7', label: 'Reminder created', timeLabel: '2h ago' },
      { id: 'ev-8', label: 'Reminder resolved', timeLabel: '1h ago' },
    ],
  },
];

@Injectable()
export class HubExceptionManagementService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly hubExceptions: HubExceptionDetail[] =
    structuredClone(hubExceptionSeed);

  async getExceptions(): Promise<HubExceptionListResponse> {
    await this.prisma.hub.findFirst();
    const summary = this.hubExceptions.reduce<
      HubExceptionListResponse['summary']
    >(
      (accumulator, exception) => {
        accumulator.total += 1;
        accumulator[exception.statusTab] += 1;
        return accumulator;
      },
      { active: 0, 'waiting-review': 0, resolved: 0, total: 0 },
    );

    return {
      summary,
      featuredExceptionId: this.hubExceptions[0].exceptionId,
      activeTab: 'active',
      exceptions: this.hubExceptions.map((exception) =>
        this.toSummary(exception),
      ),
    };
  }

  async getException(exceptionId: string): Promise<HubExceptionDetailResponse> {
    await this.prisma.hub.findFirst();
    return { exception: this.findException(exceptionId) };
  }

  async resolveException(
    exceptionId: string,
    request: HubExceptionMutationRequest = {},
  ): Promise<HubExceptionMutationResponse> {
    await this.prisma.hub.findFirst();
    const exception = this.findException(exceptionId);
    this.assertMutable(exception);
    const note = request.note?.trim() || 'Resolved by hub manager.';
    exception.statusTab = 'resolved';
    exception.nextActionLabel = note;
    exception.recommendedActionLabel = 'Resolved';
    exception.timeline = [
      {
        id: `${exception.exceptionId}-resolve`,
        label: note,
        timeLabel: 'Just now',
      },
      ...exception.timeline,
    ];

    return {
      exception,
      feedbackMessage: 'Exception resolved and cleared from the hub queue.',
    };
  }

  async escalateException(
    exceptionId: string,
    request: HubExceptionMutationRequest = {},
  ): Promise<HubExceptionMutationResponse> {
    await this.prisma.hub.findFirst();
    const exception = this.findException(exceptionId);
    this.assertMutable(exception);
    const targetOwner = request.targetOwner?.trim() || 'hub-manager';
    if (
      !['hub-manager', 'document-control', 'dispatch-lead'].includes(
        targetOwner,
      )
    ) {
      throw new ConflictException(
        this.createError(
          'INVALID_TARGET',
          exception.exceptionId,
          'Escalation target is not approved.',
          ['hub-manager', 'document-control', 'dispatch-lead'],
        ),
      );
    }
    exception.statusTab = 'waiting-review';
    exception.nextActionLabel = `Escalated to ${targetOwner}.`;
    exception.timeline = [
      {
        id: `${exception.exceptionId}-escalate`,
        label: `Escalated to ${targetOwner}.`,
        timeLabel: 'Just now',
      },
      ...exception.timeline,
    ];

    return {
      exception,
      feedbackMessage: 'Exception escalated to the approved owner.',
    };
  }

  private findException(exceptionId: string): HubExceptionDetail {
    const exception = this.hubExceptions.find(
      (item) => item.exceptionId === exceptionId,
    );
    if (!exception) {
      throw new NotFoundException(
        this.createError(
          'EXCEPTION_NOT_FOUND',
          exceptionId,
          'Exception not found',
        ),
      );
    }
    return exception;
  }

  private toSummary(exception: HubExceptionDetail): HubExceptionSummary {
    return {
      exceptionId: exception.exceptionId,
      statusTab: exception.statusTab,
      severity: exception.severity,
      title: exception.title,
      lotLabel: exception.lotLabel,
      laneLabel: exception.laneLabel,
      buyerVisibilityLabel: exception.buyerVisibilityLabel,
      recommendedActionLabel: exception.recommendedActionLabel,
      createdAgoLabel: exception.createdAgoLabel,
    };
  }

  private assertMutable(exception: HubExceptionDetail): void {
    if (exception.statusTab !== 'resolved') {
      return;
    }

    throw new ConflictException(
      this.createError(
        'INVALID_TRANSITION',
        exception.exceptionId,
        'Exception already has a bounded outcome.',
        ['active', 'waiting-review'],
      ),
    );
  }

  private createError(
    code: HubExceptionErrorResponse['error']['code'],
    exceptionId: string,
    message: string,
    allowed?: string[],
  ): HubExceptionErrorResponse {
    return { error: { code, message, exceptionId, allowed } };
  }
}
