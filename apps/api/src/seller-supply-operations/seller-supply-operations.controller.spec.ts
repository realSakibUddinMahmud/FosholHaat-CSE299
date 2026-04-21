import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type {
  SellerDwrDetailResponse,
  SellerSupplyListResponse,
  SellerSupplyMutationResponse,
} from '@fosholhaat/types';
import request from 'supertest';
import { SellerSupplyOperationsController } from './seller-supply-operations.controller';
import { SellerSupplyOperationsService } from './seller-supply-operations.service';

describe('SellerSupplyOperationsController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerSupplyOperationsController],
      providers: [SellerSupplyOperationsService],
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

  it('returns seller supply list data', async () => {
    const response = await request(getServer())
      .get('/seller/supply')
      .expect(200);
    const body = response.body as SellerSupplyListResponse;

    expect(body.workspace.primaryActionRoute).toBe('/seller/supply/new');
    expect(body.listings[1]).toMatchObject({
      id: 'supply-302',
      status: 'low-stock',
    });
  });

  it('creates a supply record', async () => {
    const response = await request(getServer())
      .post('/seller/supply')
      .send({
        commodity: 'onion',
        quantity: 14,
        unit: 'crate',
        gradeLabel: 'Late afternoon lot',
        askingPrice: 540,
      })
      .expect(201);
    const body = response.body as SellerSupplyMutationResponse;

    expect(body.listing).toMatchObject({
      commodity: 'onion',
      quantity: 14,
      status: 'scheduled',
    });
  });

  it('updates a supply record', async () => {
    const response = await request(getServer())
      .patch('/seller/supply/supply-301')
      .send({ quantity: 110, askingPrice: 1500 })
      .expect(200);
    const body = response.body as SellerSupplyMutationResponse;

    expect(body.listing).toMatchObject({
      id: 'supply-301',
      quantity: 110,
      askingPrice: 1500,
    });
  });

  it('returns the linked dwr record', async () => {
    const response = await request(getServer())
      .get('/seller/dwr/dwr-302')
      .expect(200);
    const body = response.body as SellerDwrDetailResponse;

    expect(body.record).toMatchObject({
      id: 'dwr-302',
      listingId: 'supply-302',
    });
  });

  it('returns structured not-found for missing dwr record', async () => {
    const response = await request(getServer())
      .get('/seller/dwr/missing')
      .expect(404);

    expect(response.body).toMatchObject({
      message: 'DWR record not found',
      recordId: 'missing',
    });
  });
});
