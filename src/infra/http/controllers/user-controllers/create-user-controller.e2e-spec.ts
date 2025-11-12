import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';

import { Test } from '@nestjs/testing';

import request from 'supertest';

describe('Create User (E2E)', () => {
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

  test('[POST] /create/user', async () => {
    const response = await request(app.getHttpServer())
      .post('/create/user')
      .send({
        name: 'john Doe',
        email: 'johnDoe@email.com',
        password: '123123',
      });

    const result = await prisma.user.findFirst({
      where: {
        email: 'johnDoe@email.com',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(result.email).toBe('johnDoe@email.com');
  });
});
