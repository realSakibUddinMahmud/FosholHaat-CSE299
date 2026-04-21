import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type {
  SellerOrderDetailResponse,
  SellerOrderMutationResponse,
  SellerOrderQueueResponse,
} from '@fosholhaat/types';
import request from 'supertest';
import { SellerOrdersController } from './seller-orders.controller';
import { SellerOrdersService } from './seller-orders.service';

describe('SellerOrdersController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerOrdersController],
      providers: [SellerOrdersService],
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

  it('returns the seller order queue', async () => {
    const response = await request(getServer())
      .get('/seller/orders')
      .expect(200);
    const body = response.body as SellerOrderQueueResponse;

    expect(body.summary.incoming).toBe(1);
    expect(body.orders[0]).toMatchObject({
      id: 'SO-4101',
      nextAction: 'accept',
    });
  });

  it('returns one seller order detail', async () => {
    const response = await request(getServer())
      .get('/seller/orders/SO-4102')
      .expect(200);
    const body = response.body as SellerOrderDetailResponse;

    expect(body.order).toMatchObject({
      id: 'SO-4102',
      status: 'accepted',
    });
  });

  it('accepts an incoming order', async () => {
    const response = await request(getServer())
      .post('/seller/orders/SO-4101/accept')
      .expect(201);
    const body = response.body as SellerOrderMutationResponse;

    expect(body.order.status).toBe('accepted');
  });

  it('rejects an invalid transition request', async () => {
    await request(getServer()).post('/seller/orders/SO-4101/ready').expect(400);
  });
});
