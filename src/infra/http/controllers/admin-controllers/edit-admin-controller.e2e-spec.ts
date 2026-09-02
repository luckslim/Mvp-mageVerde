import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Test } from '@nestjs/testing';

import request from 'supertest';
import { AdminFactory } from 'test/factory/make-admin-factory';

describe('Edit Admin (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let Jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    adminFactory = moduleRef.get(AdminFactory);

    Jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /edit/admin', async () => {
    const admin = await adminFactory.makePrismaAdmin({});
    const access_Token = Jwt.sign({ sub: admin.id.toString() });
    const response = await request(app.getHttpServer())
      .post('/edit/admin')
      .set('Authorization', `Bearer ${access_Token}`)
      .send({
        name: 'john Doe',
        email: 'johnDoe@gmail.com',
        password: '123123',
      });

    expect(response.statusCode).toBe(201);
  });
});
