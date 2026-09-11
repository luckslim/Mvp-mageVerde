import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventStatus } from '@/domain/enterprise/entities/events';

import { Test } from '@nestjs/testing';

import request from 'supertest';
import { AdminFactory } from 'test/factory/make-admin-factory';
import { EventFactory } from 'test/factory/make-events-factory';
import { UserFactory } from 'test/factory/make-users-factory';

describe('Delete Event (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let Jwt: JwtService;
  let adminFactory: AdminFactory;
  let eventFactory: EventFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, EventFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    Jwt = moduleRef.get(JwtService);

    adminFactory = moduleRef.get(AdminFactory);

    eventFactory = moduleRef.get(EventFactory);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /delete/event', async () => {
    const admin = await adminFactory.makePrismaAdmin({});
    const adminOnDataBase = await prisma.admin.findFirst({
      where: {
        id: admin.id.toString(),
      },
    });
    expect(adminOnDataBase).toBeTruthy();

    const event = await eventFactory.makePrismaEvent({
      authorId: admin.id.toString(),
      fileUrl:
        'https://pub-d0fb9c440d214d0696cffacabdd99a19.r2.dev/77d28447-4624-4a55-b71a-8e5457f749f1',
    });
    const eventOnDataBase = await prisma.event.findFirst({
      where: {
        id: event.id.toString(),
      },
    });
    expect(eventOnDataBase).toBeTruthy();

    const access_token = Jwt.sign({ sub: admin.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/delete/event')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        eventId: event.id.toString(),
      });
    expect(response.statusCode).toBe(201);
  });

  test('should allow admins to delete a published event from another author', async () => {
    const admin = await adminFactory.makePrismaAdmin({});
    const owner = await userFactory.makePrismaUser({});
    const otherUser = await userFactory.makePrismaUser({});
    const event = await eventFactory.makePrismaEvent({
      authorId: owner.id.toString(),
      status: EventStatus.APPROVED,
      fileUrl:
        'https://pub-d0fb9c440d214d0696cffacabdd99a19.r2.dev/77d28447-4624-4a55-b71a-8e5457f749f1',
    });
    const otherUserToken = Jwt.sign({ sub: otherUser.id.toString(), role: 'user' });
    const adminToken = Jwt.sign({ sub: admin.id.toString(), role: 'admin' });

    const forbiddenResponse = await request(app.getHttpServer())
      .post('/delete/event')
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ eventId: event.id.toString() });

    expect(forbiddenResponse.statusCode).toBe(403);

    const adminResponse = await request(app.getHttpServer())
      .post('/delete/event')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ eventId: event.id.toString() });

    expect(adminResponse.statusCode).toBe(201);
    expect(await prisma.event.findUnique({ where: { id: event.id.toString() } })).toBeNull();
  });
});
