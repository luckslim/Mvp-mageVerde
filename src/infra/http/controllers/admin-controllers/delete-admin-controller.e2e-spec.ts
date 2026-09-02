import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Test } from '@nestjs/testing';

import request from 'supertest';
import { AdminFactory } from 'test/factory/make-admin-factory';

describe('Delete Admin (E2E)', () => {
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

  test('[POST] /delete/admin', async () => {
    const admin = await adminFactory.makePrismaAdmin({});
    const access_Token = Jwt.sign({ sub: admin.id.toString() });
    const response = await request(app.getHttpServer())
      .post('/delete/admin')
      .set('Authorization', `Bearer ${access_Token}`)
      .send({
        email: admin.email,
      });

    expect(response.statusCode).toBe(202);
  });
});
