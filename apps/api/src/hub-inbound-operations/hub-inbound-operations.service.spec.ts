import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { HubInboundOperationsService } from './hub-inbound-operations.service';

describe('HubInboundOperationsService', () => {
  let service: HubInboundOperationsService;

  beforeEach(() => {
    service = new HubInboundOperationsService();
  });

  it('lists inbound receipts', () => {
    const response = service.getInboundQueue();

    expect(response.summary).toEqual({
      PENDING: 2,
      RECEIVED: 1,
      DISCREPANCY: 1,
      total: 4,
    });
    expect(response.receipts).toHaveLength(4);
  });

  it('returns receipt detail by id', () => {
    expect(service.getInboundReceipt('IR-9101').receipt).toMatchObject({
      id: 'IR-9101',
      status: 'PENDING',
    });
  });

  it('throws a structured not-found response', () => {
    try {
      service.getInboundReceipt('missing');
      fail('expected not found');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).getResponse()).toMatchObject({
        error: {
          code: 'RECEIPT_NOT_FOUND',
          receiptId: 'missing',
        },
      });
    }
  });

  it('confirms a pending receipt', () => {
    const response = service.receiveInboundReceipt('IR-9101', {
      receiverName: 'Bay lead',
    });

    expect(response.receipt.status).toBe('RECEIVED');
    expect(response.receipt.receiverName).toBe('Bay lead');
  });

  it('logs a discrepancy with a bounded payload', () => {
    const response = service.reportInboundReceiptDiscrepancy('IR-9102', {
      actualQuantity: 79,
      notes: 'Five bags short.',
    });

    expect(response.receipt.status).toBe('DISCREPANCY');
    expect(response.receipt.discrepancy).toMatchObject({
      actualQuantity: 79,
      notes: 'Five bags short.',
    });
  });

  it('rejects an invalid discrepancy payload', () => {
    expect(() =>
      service.reportInboundReceiptDiscrepancy('IR-9102', {
        actualQuantity: -1,
        notes: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects duplicate receive transitions', () => {
    expect(() => service.receiveInboundReceipt('IR-9103')).toThrow(
      ConflictException,
    );
  });
});
