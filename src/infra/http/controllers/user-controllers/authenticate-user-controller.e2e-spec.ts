import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';

import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';

import request from 'supertest';

describe('authenticate User (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /authenticate/user', async () => {
    await prisma.user.create({
      data: {
        name: 'lucas',
        email: 'lucaslima78@gmail.com',
        password: await hash('123456', 8),
      },
    });
    const response = await request(app.getHttpServer())
      .post('/authenticate/user')
      .send({
        email: 'lucaslima78@gmail.com',
        password: '123456',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      access_Token: expect.any(String),
    });
  });
});
