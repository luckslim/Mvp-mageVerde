import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EventStatus } from '@/domain/enterprise/entities/events';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factory/make-admin-factory';
import { EventFactory } from 'test/factory/make-events-factory';
import { UserFactory } from 'test/factory/make-users-factory';

describe('Admin Event Moderation (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
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
    jwt = moduleRef.get(JwtService);
    adminFactory = moduleRef.get(AdminFactory);
    eventFactory = moduleRef.get(EventFactory);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('shows pending events only to admins and allows them to approve one', async () => {
    const admin = await adminFactory.makePrismaAdmin({});
    const user = await userFactory.makePrismaUser({});
    const event = await eventFactory.makePrismaEvent({
      authorId: user.id.toString(),
      status: EventStatus.PENDING,
    });
    const userToken = jwt.sign({ sub: user.id.toString(), role: 'user' });
    const adminToken = jwt.sign({ sub: admin.id.toString(), role: 'admin' });

    const forbiddenResponse = await request(app.getHttpServer())
      .get('/admin/events')
      .set('Authorization', `Bearer ${userToken}`);

    expect(forbiddenResponse.statusCode).toBe(403);

    const listResponse = await request(app.getHttpServer())
      .get('/admin/events')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body.pendingCount).toBeGreaterThanOrEqual(1);
    expect(listResponse.body.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ props: expect.objectContaining({ status: EventStatus.PENDING }) }),
      ]),
    );

    const approveResponse = await request(app.getHttpServer())
      .patch(`/admin/events/${event.id.toString()}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: EventStatus.APPROVED });

    expect(approveResponse.statusCode).toBe(200);
    expect(
      (await prisma.event.findUnique({ where: { id: event.id.toString() } }))?.status,
    ).toBe(EventStatus.APPROVED);

    const emptyQueueResponse = await request(app.getHttpServer())
      .get('/admin/events')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(emptyQueueResponse.statusCode).toBe(200);
    expect(emptyQueueResponse.body.pendingCount).toBe(0);
    expect(emptyQueueResponse.body.events).toEqual([]);

    const duplicateDecisionResponse = await request(app.getHttpServer())
      .patch(`/admin/events/${event.id.toString()}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: EventStatus.REJECTED });

    expect(duplicateDecisionResponse.statusCode).toBe(409);

    await prisma.event.delete({ where: { id: event.id.toString() } });
    await prisma.user.delete({ where: { id: user.id.toString() } });
    await prisma.admin.delete({ where: { id: admin.id.toString() } });
  });
});
