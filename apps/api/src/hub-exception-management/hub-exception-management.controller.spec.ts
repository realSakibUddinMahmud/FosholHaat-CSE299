import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { HubExceptionListResponse } from '@fosholhaat/types';
import { HubExceptionManagementController } from './hub-exception-management.controller';
import { HubExceptionManagementService } from './hub-exception-management.service';

describe('HubExceptionManagementController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubExceptionManagementController],
      providers: [HubExceptionManagementService],
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

  it('returns exception summaries with severity and lane breakdowns', async () => {
    const response = await request(getServer())
      .get('/hub/exceptions')
      .expect(200);
    const body = response.body as HubExceptionListResponse;

    expect(body).toMatchObject({
      summary: {
        active: 2,
        'waiting-review': 1,
        resolved: 1,
        total: 4,
      },
      featuredExceptionId: 'EX-4101',
      activeTab: 'active',
    });
    expect(body.exceptions).toHaveLength(4);
    expect(body.exceptions[0]).toMatchObject({
      exceptionId: 'EX-4101',
      severity: 'high-priority',
      laneLabel: 'Warehouse A',
    });
  });

  it('returns exception detail for a known exception', async () => {
    const response = await request(getServer())
      .get('/hub/exceptions/EX-4102')
      .expect(200);

    expect(response.body).toMatchObject({
      exception: {
        exceptionId: 'EX-4102',
        title: 'Dispatch bag left unassigned',
        statusTab: 'active',
        laneLabel: 'Processing Hub',
      },
    });
  });

  it('returns a structured not-found response for an unknown exception', async () => {
    const response = await request(getServer())
      .get('/hub/exceptions/missing')
      .expect(404);

    expect(response.body).toMatchObject({
      error: {
        code: 'EXCEPTION_NOT_FOUND',
        message: 'Exception not found',
        exceptionId: 'missing',
      },
    });
  });

  it('resolves an exception with a bounded note', async () => {
    const response = await request(getServer())
      .post('/hub/exceptions/EX-4101/resolve')
      .send({ note: 'Inbound team confirmed scan totals.' })
      .expect(201);

    expect(response.body).toMatchObject({
      exception: {
        exceptionId: 'EX-4101',
        statusTab: 'resolved',
      },
      feedbackMessage: 'Exception resolved and cleared from the hub queue.',
    });
  });

  it('escalates an exception to an approved target', async () => {
    const response = await request(getServer())
      .post('/hub/exceptions/EX-4102/escalate')
      .send({ targetOwner: 'hub-manager' })
      .expect(201);

    expect(response.body).toMatchObject({
      exception: {
        exceptionId: 'EX-4102',
        statusTab: 'waiting-review',
        nextActionLabel: 'Escalated to hub-manager.',
      },
      feedbackMessage: 'Exception escalated to the approved owner.',
    });
  });

  it('returns a structured invalid-target response', async () => {
    const response = await request(getServer())
      .post('/hub/exceptions/EX-4102/escalate')
      .send({ targetOwner: 'random-team' })
      .expect(409);

    expect(response.body).toMatchObject({
      error: {
        code: 'INVALID_TARGET',
        exceptionId: 'EX-4102',
      },
    });
  });
});
