import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HubInboundOperationsController } from './hub-inbound-operations.controller';
import { HubInboundOperationsService } from './hub-inbound-operations.service';

describe('HubInboundOperationsController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubInboundOperationsController],
      providers: [HubInboundOperationsService],
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

  it('returns the inbound queue summary and receipts', async () => {
    const response = await request(getServer()).get('/hub/inbound').expect(200);
    const body = response.body as {
      summary: {
        PENDING: number;
        RECEIVED: number;
        DISCREPANCY: number;
        total: number;
      };
      featuredReceiptId: string;
      activeTab: string;
      receipts: unknown[];
    };

    expect(body).toMatchObject({
      summary: {
        PENDING: 2,
        RECEIVED: 1,
        DISCREPANCY: 1,
        total: 4,
      },
      featuredReceiptId: 'IR-9101',
      activeTab: 'PENDING',
    });
    expect(body.receipts).toHaveLength(4);
  });

  it('returns receipt detail for a known receipt', async () => {
    const response = await request(getServer())
      .get('/hub/inbound/IR-9103')
      .expect(200);

    expect(response.body).toMatchObject({
      receipt: {
        id: 'IR-9103',
        status: 'RECEIVED',
        receiverName: 'Hub receiver',
      },
    });
  });

  it('returns a structured not-found response for an unknown receipt', async () => {
    const response = await request(getServer())
      .get('/hub/inbound/missing')
      .expect(404);

    expect(response.body).toMatchObject({
      error: {
        code: 'RECEIPT_NOT_FOUND',
        message: 'Receipt not found',
        receiptId: 'missing',
      },
    });
  });

  it('confirms a pending receipt', async () => {
    const response = await request(getServer())
      .post('/hub/inbound/IR-9101/receive')
      .send({ receiverName: 'Bay lead' })
      .expect(201);

    expect(response.body).toMatchObject({
      receipt: {
        id: 'IR-9101',
        status: 'RECEIVED',
        receiverName: 'Bay lead',
      },
      feedbackMessage: 'Receipt confirmed.',
    });
  });

  it('logs a discrepancy for a pending receipt', async () => {
    const response = await request(getServer())
      .post('/hub/inbound/IR-9102/discrepancies')
      .send({ actualQuantity: 79, notes: 'Five bags short.' })
      .expect(201);

    expect(response.body).toMatchObject({
      receipt: {
        id: 'IR-9102',
        status: 'DISCREPANCY',
        discrepancy: {
          actualQuantity: 79,
          notes: 'Five bags short.',
        },
      },
      feedbackMessage: 'Discrepancy logged.',
    });
  });

  it('returns a structured invalid discrepancy response', async () => {
    const response = await request(getServer())
      .post('/hub/inbound/IR-9102/discrepancies')
      .send({ actualQuantity: -1, notes: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      error: {
        code: 'INVALID_DISCREPANCY_PAYLOAD',
        message: 'Discrepancy payload is invalid.',
        receiptId: 'IR-9102',
      },
    });
  });

  it('returns a structured duplicate receive response', async () => {
    const response = await request(getServer())
      .post('/hub/inbound/IR-9103/receive')
      .expect(409);

    expect(response.body).toMatchObject({
      error: {
        code: 'DUPLICATE_RECEIVE_TRANSITION',
        message: 'Receipt already moved past inbound receive.',
        receiptId: 'IR-9103',
      },
    });
  });
});
