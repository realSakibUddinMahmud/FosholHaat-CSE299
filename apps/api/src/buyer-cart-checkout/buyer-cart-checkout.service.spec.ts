import { BadRequestException, ConflictException } from '@nestjs/common';
import { BuyerCartCheckoutService } from './buyer-cart-checkout.service';

describe('BuyerCartCheckoutService', () => {
  let service: BuyerCartCheckoutService;

  beforeEach(() => {
    service = new BuyerCartCheckoutService();
  });

  it('returns the buyer cart', () => {
    const response = service.getBuyerCart();

    expect(response.totals).toEqual({
      subtotal: 1646,
      deliveryFee: 0,
      serviceFee: 35,
      payableTotal: 1681,
    });
    expect(response.lines).toHaveLength(3);
  });

  it('updates a cart line quantity', () => {
    const response = service.updateBuyerCartLine('CL-5101', { quantity: 10 });

    expect(response.lines[0]).toMatchObject({
      lineId: 'CL-5101',
      quantity: 10,
      subtotal: 420,
    });
  });

  it('rejects an invalid quantity', () => {
    expect(() =>
      service.updateBuyerCartLine('CL-5101', { quantity: 0 }),
    ).toThrow(BadRequestException);
  });

  it('requires fulfillment details before checkout payment', () => {
    expect(() =>
      service.setCheckoutPayment({
        method: 'cash-on-delivery',
        payableTotal: 1681,
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects missing fulfillment details', () => {
    expect(() =>
      service.setCheckoutFulfillment({
        choice: 'direct-delivery',
        recipientName: '',
        phone: '',
      } as never),
    ).toThrow(BadRequestException);
  });

  it('rejects payment validation failures', () => {
    service.setCheckoutFulfillment({
      choice: 'hub-pickup',
      recipientName: 'Buyer One',
      phone: '01700000000',
    });

    expect(() =>
      service.setCheckoutPayment({
        method: 'mobile-banking',
        payableTotal: 1,
        referenceLabel: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('submits checkout once', () => {
    service.setCheckoutFulfillment({
      choice: 'hub-pickup',
      recipientName: 'Buyer One',
      phone: '01700000000',
    });
    service.setCheckoutPayment({
      method: 'cash-on-delivery',
      payableTotal: 1681,
    });

    const response = service.submitCheckout();

    expect(response.successRoute).toBe('/buyer/orders/success');
    expect(response.orderId).toEqual(expect.any(String));
  });

  it('rejects duplicate checkout submission', () => {
    service.setCheckoutFulfillment({
      choice: 'hub-pickup',
      recipientName: 'Buyer One',
      phone: '01700000000',
    });
    service.setCheckoutPayment({
      method: 'cash-on-delivery',
      payableTotal: 1681,
    });
    service.submitCheckout();

    expect(() => service.submitCheckout()).toThrow(ConflictException);
  });
});
