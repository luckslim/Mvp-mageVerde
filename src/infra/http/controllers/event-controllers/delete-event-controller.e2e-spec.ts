import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Test } from '@nestjs/testing';

import request from 'supertest';
import { AdminFactory } from 'test/factory/make-admin-factory';
import { AuthorFactory } from 'test/factory/make-author-factory';
import { EventFactory } from 'test/factory/make-events-factory';

describe('Delete Event (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let Jwt: JwtService;
  let adminFactory: AdminFactory;
  let authorFactory: AuthorFactory;
  let eventFactory: EventFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, AuthorFactory, EventFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    Jwt = moduleRef.get(JwtService);

    adminFactory = moduleRef.get(AdminFactory);

    authorFactory = moduleRef.get(AuthorFactory);

    eventFactory = moduleRef.get(EventFactory);

    await app.init();
  });

  test('[POST] /create/event', async () => {
    const admin = await adminFactory.makePrismaAdmin({});
    const adminOnDataBase = await prisma.admin.findFirst({
      where: {
        id: admin.id.toString(),
      },
    });
    expect(adminOnDataBase).toBeTruthy();

    const author = await authorFactory.makePrismaAuthor({
      authorId: admin.id.toString(),
    });
    const authorOnDataBase = await prisma.author.findFirst({
      where: {
        id: author.id.toString(),
      },
    });
    expect(authorOnDataBase).toBeTruthy();

    const event = await eventFactory.makePrismaEvent({
      authorId: author.authorId,
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
});
