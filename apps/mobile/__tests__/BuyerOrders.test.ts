import { getOrderById, getOrderTracking } from '../src/app/buyer/order-data';

describe('BuyerOrders helpers', () => {
  it('finds a known order', () => {
    expect(getOrderById('FH-8492')?.id).toBe('FH-8492');
  });

  it('returns null for a missing order', () => {
    expect(getOrderById('missing')).toBeNull();
  });

  it('returns tracking for a known order', () => {
    expect(getOrderTracking('FH-8492')?.orderId).toBe('FH-8492');
    expect(getOrderTracking('FH-8492')?.timeline).toHaveLength(4);
  });

  it('returns null for missing tracking', () => {
    expect(getOrderTracking('missing')).toBeNull();
  });
});
