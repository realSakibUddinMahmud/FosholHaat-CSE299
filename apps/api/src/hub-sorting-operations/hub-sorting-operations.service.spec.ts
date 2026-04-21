import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { HubSortingOperationsService } from './hub-sorting-operations.service';

describe('HubSortingOperationsService', () => {
  let service: HubSortingOperationsService;

  beforeEach(() => {
    service = new HubSortingOperationsService();
  });

  it('lists sorting batches', () => {
    const response = service.getSortingQueue();

    expect(response.summary).toEqual({
      READY: 2,
      IN_PROGRESS: 1,
      HOLD: 1,
      COMPLETE: 1,
      total: 5,
    });
    expect(response.batches).toHaveLength(5);
  });

  it('returns batch detail by id', () => {
    expect(service.getSortingBatch('SB-3401').batch).toMatchObject({
      batchId: 'SB-3401',
      status: 'READY',
    });
  });

  it('throws a structured not-found response', () => {
    try {
      service.getSortingBatch('missing');
      fail('expected not found');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).getResponse()).toMatchObject({
        error: {
          code: 'BATCH_NOT_FOUND',
          batchId: 'missing',
        },
      });
    }
  });

  it('starts a ready batch', () => {
    const response = service.startSortingBatch('SB-3401', {
      operatorName: 'Lane lead',
    });

    expect(response.batch.status).toBe('IN_PROGRESS');
    expect(response.batch.receiverLabel).toBe('Lane lead');
  });

  it('holds an in-progress batch', () => {
    const response = service.holdSortingBatch('SB-3403', {
      reason: 'quality-check',
      note: 'Recount needed.',
    });

    expect(response.batch.status).toBe('HOLD');
    expect(response.batch.holdRecord).toMatchObject({
      reason: 'quality-check',
      note: 'Recount needed.',
    });
  });

  it('completes a batch from hold', () => {
    const response = service.completeSortingBatch('SB-3404');

    expect(response.batch.status).toBe('COMPLETE');
  });

  it('rejects an invalid transition', () => {
    expect(() => service.startSortingBatch('SB-3405')).toThrow(
      ConflictException,
    );
  });

  it('rejects a missing hold reason', () => {
    expect(() =>
      service.holdSortingBatch('SB-3403', {
        reason: '' as never,
        note: '',
      }),
    ).toThrow(BadRequestException);
  });
});
