import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Test } from '@nestjs/testing';

import request from 'supertest';
import { UserFactory } from 'test/factory/make-users-factory';

describe('Delete User (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let Jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);

    Jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /delete/user', async () => {
    const user = await userFactory.makePrismaUser({});
    const access_Token = Jwt.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .post('/delete/user')
      .set('Authorization', `Bearer ${access_Token}`)
      .send({
        email: user.email,
      });

    expect(response.statusCode).toBe(202);
  });
});
