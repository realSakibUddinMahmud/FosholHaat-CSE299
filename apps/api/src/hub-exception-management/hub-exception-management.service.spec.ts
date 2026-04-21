import { ConflictException, NotFoundException } from '@nestjs/common';
import { HubExceptionManagementService } from './hub-exception-management.service';

describe('HubExceptionManagementService', () => {
  let service: HubExceptionManagementService;

  beforeEach(() => {
    service = new HubExceptionManagementService();
  });

  it('lists exceptions with severity and lane summaries', () => {
    const response = service.getExceptions();

    expect(response.summary).toMatchObject({
      active: 2,
      'waiting-review': 1,
      resolved: 1,
      total: 4,
    });
    expect(response.featuredExceptionId).toBe('EX-4101');
    expect(response.exceptions).toHaveLength(4);
  });

  it('returns a known exception detail', () => {
    expect(service.getException('EX-4102').exception).toMatchObject({
      exceptionId: 'EX-4102',
      severity: 'critical',
      laneLabel: 'Processing Hub',
      statusTab: 'active',
    });
  });

  it('throws a structured not-found response', () => {
    try {
      service.getException('missing');
      fail('expected not found');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).getResponse()).toMatchObject({
        error: {
          code: 'EXCEPTION_NOT_FOUND',
          exceptionId: 'missing',
        },
      });
    }
  });

  it('resolves an open exception with an approved note', () => {
    const response = service.resolveException('EX-4101', {
      note: 'Inbound team confirmed scan totals.',
    });

    expect(response.exception.statusTab).toBe('resolved');
    expect(response.exception.nextActionLabel).toBe(
      'Inbound team confirmed scan totals.',
    );
  });

  it('escalates an open exception to an approved owner', () => {
    const response = service.escalateException('EX-4102', {
      targetOwner: 'hub-manager',
    });

    expect(response.exception.statusTab).toBe('waiting-review');
    expect(response.exception.nextActionLabel).toBe(
      'Escalated to hub-manager.',
    );
  });

  it('rejects an unapproved escalation target', () => {
    expect(() =>
      service.escalateException('EX-4101', { targetOwner: 'random-team' }),
    ).toThrow(ConflictException);
  });

  it('rejects invalid transitions', () => {
    expect(() => service.resolveException('EX-4104')).toThrow(
      ConflictException,
    );
  });
});
