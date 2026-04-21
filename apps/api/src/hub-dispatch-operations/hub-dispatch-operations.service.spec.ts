import { ConflictException, NotFoundException } from '@nestjs/common';
import { HubDispatchOperationsService } from './hub-dispatch-operations.service';

describe('HubDispatchOperationsService', () => {
  let service: HubDispatchOperationsService;

  beforeEach(() => {
    service = new HubDispatchOperationsService();
  });

  it('lists dispatch loads', () => {
    const response = service.getDispatchQueue();

    expect(response.summary).toEqual({
      staging: 1,
      ready: 1,
      departed: 1,
      total: 3,
    });
    expect(response.loads).toHaveLength(3);
  });

  it('returns load detail by id', () => {
    expect(service.getDispatchLoad('LD-2048').load).toMatchObject({
      loadId: 'LD-2048',
      status: 'staging',
    });
  });

  it('throws a structured not-found response', () => {
    try {
      service.getDispatchLoad('missing');
      fail('expected not found');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).getResponse()).toMatchObject({
        error: {
          code: 'LOAD_NOT_FOUND',
          loadId: 'missing',
        },
      });
    }
  });

  it('enforces assign transition', () => {
    expect(service.assignDispatchLoad('LD-2048').load.status).toBe('ready');
  });

  it('rejects invalid assign transition', () => {
    expect(() => service.assignDispatchLoad('LD-2050')).toThrow(
      ConflictException,
    );
  });

  it('enforces dispatched transition', () => {
    expect(service.markDispatchLoadDispatched('LD-2049').load.status).toBe(
      'departed',
    );
  });

  it('rejects invalid dispatched transition', () => {
    expect(() => service.markDispatchLoadDispatched('LD-2048')).toThrow(
      ConflictException,
    );
  });
});
