import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type {
  SellerPayoutDetailResponse,
  SellerPayoutListResponse,
} from '@fosholhaat/types';
import request from 'supertest';
import { SellerPayoutsController } from './seller-payouts.controller';
import { SellerPayoutsService } from './seller-payouts.service';

describe('SellerPayoutsController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerPayoutsController],
      providers: [SellerPayoutsService],
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

  it('returns payout summary and periods', async () => {
    const response = await request(getServer())
      .get('/seller/payouts')
      .expect(200);
    const body = response.body as SellerPayoutListResponse;

    expect(body.summary).toMatchObject({
      pending: 8920,
      completed: 36280,
      total: 45200,
      nextDisbursementAmount: 8920,
      nextDisbursementDate: '2026-11-05',
    });
    expect(body.records).toHaveLength(3);
    expect(body.featuredDetailId).toBe('payout-2026-10-28');
    expect(body.records[0]).toMatchObject({
      id: 'payout-2026-10-28',
      status: 'settled',
      amount: 12450,
    });
  });

  it('returns payout detail for a known payout id', async () => {
    const response = await request(getServer())
      .get('/seller/payouts/payout-2026-10-27')
      .expect(200);
    const body = response.body as SellerPayoutDetailResponse;

    expect(body.payout).toMatchObject({
      id: 'payout-2026-10-27',
      referenceCode: '#TR-10488',
      status: 'processing',
      amount: 8920,
      payoutAccountLabel: 'bKash merchant balance',
    });
    expect(body.payout.breakdown).toEqual([
      { label: 'Orders settled', amount: 9260 },
      { label: 'Service fee', amount: -340 },
    ]);
  });

  it('returns a structured not-found response for an unknown payout id', async () => {
    const response = await request(getServer())
      .get('/seller/payouts/missing-payout')
      .expect(404);

    expect(response.body).toMatchObject({
      message: 'Payout not found',
      payoutId: 'missing-payout',
    });
  });
});
