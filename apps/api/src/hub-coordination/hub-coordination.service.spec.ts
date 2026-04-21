import { BadRequestException } from '@nestjs/common';
import { HubCoordinationService } from './hub-coordination.service';

describe('HubCoordinationService', () => {
  let service: HubCoordinationService;

  beforeEach(() => {
    service = new HubCoordinationService();
  });

  it('returns the coordination overview', () => {
    const response = service.getOverview();

    expect(response.lanes).toHaveLength(4);
    expect(response.alerts[0]).toMatchObject({
      id: 'hub-alert-01',
      severity: 'medium',
    });
  });

  it('saves a bounded assignment update', () => {
    const response = service.assignLane({
      laneKey: 'sorting',
      assigneeId: '  worker-17  ',
    });

    expect(response).toEqual({
      success: true,
      message: 'Assignment saved',
      assignment: {
        laneKey: 'sorting',
        assigneeId: 'worker-17',
      },
    });
  });

  it('rejects invalid lane keys', () => {
    expect(() =>
      service.assignLane({
        laneKey: 'finance' as never,
        assigneeId: 'worker-17',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects missing assignee ids', () => {
    expect(() =>
      service.assignLane({
        laneKey: 'dispatch',
        assigneeId: '   ',
      }),
    ).toThrow(BadRequestException);
  });
});
