import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  HubDispatchDetailResponse,
  HubDispatchErrorResponse,
  HubDispatchLoadDetail,
  HubDispatchLoadStatus,
  HubDispatchMutationResponse,
  HubDispatchQueueItem,
  HubDispatchQueueResponse,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

const hubDispatchLoadSeed: HubDispatchLoadDetail[] = [
  {
    loadId: 'LD-2048',
    routeName: 'Dhaka North Cluster',
    destination: 'Mirpur, Dhaka',
    corridor: 'North corridor',
    status: 'staging',
    assignmentState: 'unassigned',
    stopCount: 8,
    parcelCount: 42,
    assignee: null,
    assignedAt: null,
    dispatchedAt: null,
    vehicleId: 'TRK-11',
    loadingBay: 'Bay 2',
    priority: 'high',
    note: 'Ready for dispatch.',
    updatedAt: '2026-04-20T08:00:00.000Z',
    metric: {
      stagedParcels: 34,
      totalParcels: 42,
      remainingParcels: 8,
      readinessPercent: 81,
    },
    manifest: [
      {
        lotLabel: 'Lot 11',
        productLabel: 'Onion sacks',
        quantityLabel: '18 sacks',
        verificationLabel: 'Checked',
      },
      {
        lotLabel: 'Lot 18',
        productLabel: 'Potato crates',
        quantityLabel: '24 crates',
        verificationLabel: 'Pending gate seal',
      },
    ],
  },
  {
    loadId: 'LD-2049',
    routeName: 'Uttara Line',
    destination: 'Uttara, Dhaka',
    corridor: 'North corridor',
    status: 'ready',
    assignmentState: 'assigned',
    stopCount: 6,
    parcelCount: 31,
    assignee: 'Dispatch lead',
    assignedAt: '2026-04-20T07:25:00.000Z',
    dispatchedAt: null,
    vehicleId: 'TRK-08',
    loadingBay: 'Bay 1',
    priority: 'normal',
    note: 'Driver briefed.',
    updatedAt: '2026-04-20T07:25:00.000Z',
    metric: {
      stagedParcels: 31,
      totalParcels: 31,
      remainingParcels: 0,
      readinessPercent: 100,
    },
    manifest: [
      {
        lotLabel: 'Lot 07',
        productLabel: 'Vegetable baskets',
        quantityLabel: '12 baskets',
        verificationLabel: 'Checked',
      },
      {
        lotLabel: 'Lot 09',
        productLabel: 'Potato bags',
        quantityLabel: '19 bags',
        verificationLabel: 'Checked',
      },
    ],
  },
  {
    loadId: 'LD-2050',
    routeName: 'Gazipur Run',
    destination: 'Gazipur',
    corridor: 'North corridor',
    status: 'departed',
    assignmentState: 'assigned',
    stopCount: 9,
    parcelCount: 58,
    assignee: 'Driver A',
    assignedAt: '2026-04-20T06:40:00.000Z',
    dispatchedAt: '2026-04-20T07:05:00.000Z',
    vehicleId: 'TRK-14',
    loadingBay: 'Bay 4',
    priority: 'high',
    note: 'Left hub on time.',
    updatedAt: '2026-04-20T07:05:00.000Z',
    metric: {
      stagedParcels: 58,
      totalParcels: 58,
      remainingParcels: 0,
      readinessPercent: 100,
    },
    manifest: [
      {
        lotLabel: 'Lot 22',
        productLabel: 'Onion sacks',
        quantityLabel: '26 sacks',
        verificationLabel: 'Checked',
      },
      {
        lotLabel: 'Lot 27',
        productLabel: 'Vegetable cartons',
        quantityLabel: '32 cartons',
        verificationLabel: 'Checked',
      },
    ],
  },
];

@Injectable()
export class HubDispatchOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly hubDispatchLoads: HubDispatchLoadDetail[] =
    structuredClone(hubDispatchLoadSeed);

  async getDispatchQueue(): Promise<HubDispatchQueueResponse> {
    await this.prisma.hub.findFirst();
    const summary = this.hubDispatchLoads.reduce<
      HubDispatchQueueResponse['summary']
    >(
      (accumulator, load) => {
        accumulator[load.status] += 1;
        accumulator.total += 1;
        return accumulator;
      },
      { staging: 0, ready: 0, departed: 0, total: 0 },
    );

    return {
      summary,
      loads: this.hubDispatchLoads.map((load) => this.toQueueItem(load)),
      featuredLoadId: this.hubDispatchLoads[0].loadId,
      activeTab: 'staging',
    };
  }

  async getDispatchLoad(loadId: string): Promise<HubDispatchDetailResponse> {
    await this.prisma.hub.findFirst();
    return { load: this.findLoad(loadId) };
  }

  async assignDispatchLoad(
    loadId: string,
  ): Promise<HubDispatchMutationResponse> {
    await this.prisma.hub.findFirst();
    const load = this.findLoad(loadId);
    this.assertTransition(load, 'staging', 'assign');

    const assignedAt = new Date().toISOString();
    load.status = 'ready';
    load.assignmentState = 'assigned';
    load.assignee = 'Dispatch lead';
    load.assignedAt = assignedAt;
    load.note = 'Assigned for loading.';
    load.updatedAt = assignedAt;
    load.metric.stagedParcels = load.metric.totalParcels;
    load.metric.remainingParcels = 0;
    load.metric.readinessPercent = 100;

    return { load, feedbackMessage: 'Load assigned and ready.' };
  }

  async markDispatchLoadDispatched(
    loadId: string,
  ): Promise<HubDispatchMutationResponse> {
    await this.prisma.hub.findFirst();
    const load = this.findLoad(loadId);
    this.assertTransition(load, 'ready', 'dispatched');

    const dispatchedAt = new Date().toISOString();
    load.status = 'departed';
    load.dispatchedAt = dispatchedAt;
    load.note = 'Dispatched from hub.';
    load.updatedAt = dispatchedAt;

    return { load, feedbackMessage: 'Load dispatched from hub.' };
  }

  private findLoad(loadId: string): HubDispatchLoadDetail {
    const load = this.hubDispatchLoads.find((item) => item.loadId === loadId);
    if (!load) {
      throw new NotFoundException(
        this.createError('LOAD_NOT_FOUND', loadId, 'Load not found'),
      );
    }
    return load;
  }

  private toQueueItem(load: HubDispatchLoadDetail): HubDispatchQueueItem {
    return {
      loadId: load.loadId,
      routeName: load.routeName,
      destination: load.destination,
      corridor: load.corridor,
      status: load.status,
      assignmentState: load.assignmentState,
      stopCount: load.stopCount,
      parcelCount: load.parcelCount,
      assignee: load.assignee,
      assignedAt: load.assignedAt,
      dispatchedAt: load.dispatchedAt,
    };
  }

  private assertTransition(
    load: HubDispatchQueueItem,
    expectedState: HubDispatchLoadStatus,
    action: string,
  ): void {
    if (load.status === expectedState) {
      return;
    }

    throw new ConflictException(
      this.createError(
        'INVALID_TRANSITION',
        load.loadId,
        'Cannot ' + action + ' load from current state',
        load.status,
        [expectedState],
      ),
    );
  }

  private createError(
    code: HubDispatchErrorResponse['error']['code'],
    loadId: string,
    message: string,
    currentState?: HubDispatchLoadStatus,
    allowed?: HubDispatchLoadStatus[],
  ): HubDispatchErrorResponse {
    return { error: { code, message, loadId, currentState, allowed } };
  }
}
