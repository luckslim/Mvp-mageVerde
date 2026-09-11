import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factory/make-admin-factory';
import { EventFactory } from 'test/factory/make-events-factory';
import { JwtService } from '@nestjs/jwt';

describe('Create Event (E2E)', () => {
  let app: INestApplication;

  let eventFactory: EventFactory;
  let adminFactory: AdminFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [EventFactory, AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    eventFactory = moduleRef.get(EventFactory);

    adminFactory = moduleRef.get(AdminFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /get/events', async () => {
    const admin = await adminFactory.makePrismaAdmin({});

    await eventFactory.makePrismaEvent({
      authorId: admin.id.toString(),
    });

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(`/get/events`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBeTruthy();
  });
});
