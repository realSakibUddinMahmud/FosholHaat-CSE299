import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HubSortingOperationsController } from './hub-sorting-operations.controller';
import { HubSortingOperationsService } from './hub-sorting-operations.service';

describe('HubSortingOperationsController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubSortingOperationsController],
      providers: [HubSortingOperationsService],
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

  it('returns the sorting queue summary and batches', async () => {
    const response = await request(getServer()).get('/hub/sorting').expect(200);
    const body = response.body as {
      batches: unknown[];
      summary: Record<string, unknown>;
      featuredBatchId: string;
      activeTab: string;
    };

    expect(body).toMatchObject({
      summary: {
        READY: 2,
        IN_PROGRESS: 1,
        HOLD: 1,
        COMPLETE: 1,
        total: 5,
      },
      featuredBatchId: 'SB-3401',
      activeTab: 'READY',
    });
    expect(body.batches).toHaveLength(5);
  });

  it('returns batch detail for a known batch', async () => {
    const response = await request(getServer())
      .get('/hub/sorting/SB-3404')
      .expect(200);

    expect(response.body).toMatchObject({
      batch: {
        batchId: 'SB-3404',
        status: 'HOLD',
        holdRecord: {
          reason: 'count-mismatch',
        },
      },
    });
  });

  it('returns a structured not-found response for an unknown batch', async () => {
    const response = await request(getServer())
      .get('/hub/sorting/missing')
      .expect(404);

    expect(response.body).toMatchObject({
      error: {
        code: 'BATCH_NOT_FOUND',
        message: 'Batch not found',
        batchId: 'missing',
      },
    });
  });

  it('starts a ready batch', async () => {
    const response = await request(getServer())
      .post('/hub/sorting/SB-3401/start')
      .send({ operatorName: 'Lane lead' })
      .expect(201);

    expect(response.body).toMatchObject({
      batch: {
        batchId: 'SB-3401',
        status: 'IN_PROGRESS',
        receiverLabel: 'Lane lead',
      },
      feedbackMessage: 'Batch started.',
    });
  });

  it('holds an in-progress batch', async () => {
    const response = await request(getServer())
      .post('/hub/sorting/SB-3403/hold')
      .send({ reason: 'label-review', note: 'Label needs recheck.' })
      .expect(201);

    expect(response.body).toMatchObject({
      batch: {
        batchId: 'SB-3403',
        status: 'HOLD',
        holdRecord: {
          reason: 'label-review',
          note: 'Label needs recheck.',
        },
      },
      feedbackMessage: 'Batch moved to hold.',
    });
  });

  it('completes a batch from hold', async () => {
    const response = await request(getServer())
      .post('/hub/sorting/SB-3404/complete')
      .expect(201);

    expect(response.body).toMatchObject({
      batch: {
        batchId: 'SB-3404',
        status: 'COMPLETE',
      },
      feedbackMessage: 'Batch completed.',
    });
  });

  it('returns a structured invalid transition response', async () => {
    const response = await request(getServer())
      .post('/hub/sorting/SB-3405/start')
      .expect(409);

    expect(response.body).toMatchObject({
      error: {
        code: 'INVALID_BATCH_TRANSITION',
        batchId: 'SB-3405',
      },
    });
  });

  it('returns a structured missing hold reason response', async () => {
    const response = await request(getServer())
      .post('/hub/sorting/SB-3403/hold')
      .send({ reason: '', note: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      error: {
        code: 'MISSING_HOLD_REASON',
        message: 'Hold reason and note are required.',
        batchId: 'SB-3403',
      },
    });
  });
});
