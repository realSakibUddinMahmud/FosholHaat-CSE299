import { BadRequestException } from '@nestjs/common';
import { SellerOrdersService } from './seller-orders.service';

describe('SellerOrdersService', () => {
  let service: SellerOrdersService;

  beforeEach(() => {
    service = new SellerOrdersService();
  });

  it('returns the seller order queue', () => {
    const response = service.getSellerOrders();

    expect(response.summary).toEqual({
      incoming: 1,
      active: 2,
      ready: 0,
    });
    expect(response.orders).toHaveLength(3);
  });

  it('moves an order through valid transitions', () => {
    expect(service.acceptSellerOrder('SO-4101').order.status).toBe('accepted');
    expect(service.packSellerOrder('SO-4102').order.status).toBe('packed');
    expect(service.readySellerOrder('SO-4103').order.status).toBe('ready');
  });

  it('rejects an invalid transition', () => {
    expect(() => service.packSellerOrder('SO-4101')).toThrow(
      BadRequestException,
    );
  });
});
