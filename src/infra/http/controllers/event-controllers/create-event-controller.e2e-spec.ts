import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Test } from '@nestjs/testing';

import request from 'supertest';
import { AdminFactory } from 'test/factory/make-admin-factory';

describe('Create Event (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let Jwt: JwtService;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    Jwt = moduleRef.get(JwtService);

    adminFactory = moduleRef.get(AdminFactory);

    await app.init();
  });

  test('[POST] /create/event', async () => {
    const admin = await adminFactory.makePrismaAdmin({});
    const access_token = Jwt.sign({ sub: admin.id.toString() });
    const response = await request(app.getHttpServer())
      .post('/create/event')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title: 'title',
        content: 'content',
        time: '18H',
        colaborators: 'Prefeitura',
      });
    console.log(response.body);
    expect(response.statusCode).toBe(201);
  });
});
