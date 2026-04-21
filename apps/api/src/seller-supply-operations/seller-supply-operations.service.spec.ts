import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SellerSupplyOperationsService } from './seller-supply-operations.service';

describe('SellerSupplyOperationsService', () => {
  let service: SellerSupplyOperationsService;

  beforeEach(() => {
    service = new SellerSupplyOperationsService();
  });

  it('returns seller supply workspace data', () => {
    const response = service.getSellerSupply();

    expect(response.workspace.sellerName).toBe('GreenField Traders');
    expect(response.listings).toHaveLength(3);
    expect(response.listings[0]).toMatchObject({
      id: 'supply-301',
      commodity: 'potato',
      dwrRecordId: 'dwr-301',
    });
  });

  it('creates a valid supply record', () => {
    const response = service.createSellerSupply({
      commodity: 'potato',
      quantity: 20,
      unit: 'bag',
      gradeLabel: 'Fresh lot',
      askingPrice: 1300,
      availableFrom: '2026-04-25',
    });

    expect(response.listing).toMatchObject({
      commodity: 'potato',
      quantity: 20,
      unit: 'bag',
      status: 'scheduled',
    });
  });

  it('rejects invalid create payloads', () => {
    expect(() =>
      service.createSellerSupply({
        commodity: 'potato',
        quantity: 0,
        unit: 'bag',
        gradeLabel: 'A',
        askingPrice: 1200,
      }),
    ).toThrow(BadRequestException);
  });

  it('updates only seller-owned supply fields', () => {
    const response = service.updateSellerSupply('supply-302', {
      quantity: 30,
      askingPrice: 700,
      status: 'active',
    });

    expect(response.listing).toMatchObject({
      id: 'supply-302',
      quantity: 30,
      askingPrice: 700,
      status: 'active',
    });
  });

  it('returns the seller dwr detail', () => {
    const response = service.getSellerDwrRecord('dwr-301');

    expect(response.record).toMatchObject({
      id: 'dwr-301',
      listingId: 'supply-301',
      hubLabel: 'Bogura consolidation hub',
    });
  });

  it('rejects missing records', () => {
    expect(() => service.getSellerDwrRecord('missing')).toThrow(
      NotFoundException,
    );
  });
});
