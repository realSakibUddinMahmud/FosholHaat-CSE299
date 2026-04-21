import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HubDispatchOperationsController } from './hub-dispatch-operations.controller';
import { HubDispatchOperationsService } from './hub-dispatch-operations.service';

describe('HubDispatchOperationsController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubDispatchOperationsController],
      providers: [HubDispatchOperationsService],
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

  it('returns the dispatch queue summary and loads', async () => {
    const response = await request(getServer())
      .get('/hub/dispatch')
      .expect(200);
    const body = response.body as {
      summary: {
        staging: number;
        ready: number;
        departed: number;
        total: number;
      };
      featuredLoadId: string;
      activeTab: string;
      loads: Array<{
        loadId: string;
        status: string;
        destination: string;
      }>;
    };

    expect(body).toMatchObject({
      summary: {
        staging: 1,
        ready: 1,
        departed: 1,
        total: 3,
      },
      featuredLoadId: 'LD-2048',
      activeTab: 'staging',
    });
    expect(body.loads).toHaveLength(3);
    expect(body.loads[0]).toMatchObject({
      loadId: 'LD-2048',
      status: 'staging',
      destination: 'Mirpur, Dhaka',
    });
  });

  it('returns load detail for a known load', async () => {
    const response = await request(getServer())
      .get('/hub/dispatch/LD-2049')
      .expect(200);

    expect(response.body).toMatchObject({
      load: {
        loadId: 'LD-2049',
        routeName: 'Uttara Line',
        status: 'ready',
        assignee: 'Dispatch lead',
      },
    });
  });

  it('returns a structured not-found response for an unknown load', async () => {
    const response = await request(getServer())
      .get('/hub/dispatch/missing-load')
      .expect(404);

    expect(response.body).toMatchObject({
      error: {
        code: 'LOAD_NOT_FOUND',
        message: 'Load not found',
        loadId: 'missing-load',
      },
    });
  });

  it('assigns a queued load', async () => {
    const response = await request(getServer())
      .post('/hub/dispatch/LD-2048/assign')
      .expect(201);

    expect(response.body).toMatchObject({
      load: {
        loadId: 'LD-2048',
        status: 'ready',
        assignee: 'Dispatch lead',
      },
      feedbackMessage: 'Load assigned and ready.',
    });
  });

  it('marks an assigned load dispatched', async () => {
    const response = await request(getServer())
      .post('/hub/dispatch/LD-2049/dispatched')
      .expect(201);

    expect(response.body).toMatchObject({
      load: {
        loadId: 'LD-2049',
        status: 'departed',
      },
      feedbackMessage: 'Load dispatched from hub.',
    });
  });

  it('returns a structured invalid-transition response', async () => {
    const response = await request(getServer())
      .post('/hub/dispatch/LD-2050/assign')
      .expect(409);

    expect(response.body).toMatchObject({
      error: {
        code: 'INVALID_TRANSITION',
        loadId: 'LD-2050',
        currentState: 'departed',
        allowed: ['staging'],
      },
    });
  });
});
