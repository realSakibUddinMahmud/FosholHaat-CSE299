import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type {
  HubCoordinationAssignmentResponse,
  HubCoordinationResponse,
} from '@fosholhaat/types';
import request from 'supertest';
import { HubCoordinationController } from './hub-coordination.controller';
import { HubCoordinationService } from './hub-coordination.service';

describe('HubCoordinationController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubCoordinationController],
      providers: [HubCoordinationService],
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

  it('returns the coordination overview', async () => {
    const response = await request(getServer())
      .get('/hub/coordination')
      .expect(200);
    const body = response.body as HubCoordinationResponse;

    expect(body.lanes).toHaveLength(4);
    expect(body.alerts[1]).toMatchObject({
      id: 'hub-alert-02',
      severity: 'high',
    });
  });

  it('accepts bounded assignment updates', async () => {
    const response = await request(getServer())
      .post('/hub/coordination/assignments')
      .send({ laneKey: 'inbound', assigneeId: 'hub-lead-2' })
      .expect(201);
    const body = response.body as HubCoordinationAssignmentResponse;

    expect(body).toEqual({
      success: true,
      message: 'Assignment saved',
      assignment: {
        laneKey: 'inbound',
        assigneeId: 'hub-lead-2',
      },
    });
  });

  it('rejects invalid assignments', async () => {
    await request(getServer())
      .post('/hub/coordination/assignments')
      .send({ laneKey: 'finance', assigneeId: '' })
      .expect(400);
  });
});
