import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type {
  BuyerCartResponse,
  BuyerCheckoutSubmitResponse,
  BuyerPaymentResponse,
} from '@fosholhaat/types';
import request from 'supertest';
import { BuyerCartCheckoutController } from './buyer-cart-checkout.controller';
import { BuyerCartCheckoutService } from './buyer-cart-checkout.service';

describe('BuyerCartCheckoutController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyerCartCheckoutController],
      providers: [BuyerCartCheckoutService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  function getServer() {
    return app.getHttpServer() as Parameters<typeof request>[0];
  }

  it('returns the buyer cart', async () => {
    const response = await request(getServer()).get('/buyer/cart').expect(200);
    const body = response.body as BuyerCartResponse;

    expect(body).toMatchObject({
      nextRoute: '/buyer/checkout',
      totals: {
        subtotal: 1646,
        deliveryFee: 0,
        serviceFee: 35,
        payableTotal: 1681,
      },
    });
    expect(body.lines).toHaveLength(3);
  });

  it('updates a cart line quantity', async () => {
    const response = await request(getServer())
      .patch('/buyer/cart/items/CL-5101')
      .send({ quantity: 10 })
      .expect(200);
    const body = response.body as BuyerCartResponse;
    const line = body.lines.find((item) => item.lineId === 'CL-5101');

    expect(line).toBeDefined();
    expect(line?.quantity).toBe(10);
  });

  it('creates fulfillment details', async () => {
    const response = await request(getServer())
      .post('/buyer/checkout/fulfillment')
      .send({
        choice: 'direct-delivery',
        recipientName: 'Buyer One',
        phone: '01700000000',
        addressLabel: 'Mirpur, Dhaka',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      fulfillment: {
        choice: 'direct-delivery',
        recipientName: 'Buyer One',
      },
      nextRoute: '/buyer/checkout/payment',
    });
  });

  it('validates payment details', async () => {
    await request(getServer())
      .post('/buyer/checkout/fulfillment')
      .send({
        choice: 'hub-pickup',
        recipientName: 'Buyer One',
        phone: '01700000000',
      })
      .expect(201);

    const response = await request(getServer())
      .post('/buyer/checkout/payment')
      .send({
        method: 'mobile-banking',
        payableTotal: 1681,
        referenceLabel: 'bKash ref 123',
      })
      .expect(201);
    const body = response.body as BuyerPaymentResponse;

    expect(body).toMatchObject({
      payment: {
        method: 'mobile-banking',
        payableTotal: 1681,
      },
      nextRoute: '/buyer/checkout/confirmation',
    });
  });

  it('submits checkout', async () => {
    await request(getServer())
      .post('/buyer/checkout/fulfillment')
      .send({
        choice: 'hub-pickup',
        recipientName: 'Buyer One',
        phone: '01700000000',
      })
      .expect(201);
    await request(getServer())
      .post('/buyer/checkout/payment')
      .send({
        method: 'cash-on-delivery',
        payableTotal: 1681,
      })
      .expect(201);

    const response = await request(getServer())
      .post('/buyer/checkout/submit')
      .expect(201);
    const body = response.body as BuyerCheckoutSubmitResponse;

    expect(body.successRoute).toBe('/buyer/orders/success');
    expect(body.orderId).toEqual(expect.any(String));
  });

  it('returns an empty-cart error when the cart is empty', async () => {
    const service = app.get(BuyerCartCheckoutService);
    (service as unknown as { cartLines: unknown[] }).cartLines = [];

    const response = await request(getServer())
      .post('/buyer/checkout/submit')
      .expect(400);

    expect(response.body).toMatchObject({
      error: {
        code: 'EMPTY_CART',
        message: 'Cart is empty.',
      },
    });
  });
});
