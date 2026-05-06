import { getOrderCopy } from '../src/app/buyer/order-data';

describe('BuyerOrders copy', () => {
  it('uses English when selected', () => {
    expect(getOrderCopy('en').listTitle).toBe('My Orders');
  });

  it('uses Bangla when selected', () => {
    expect(getOrderCopy('bn').listTitle).toBe('আমার অর্ডার');
  });
});
