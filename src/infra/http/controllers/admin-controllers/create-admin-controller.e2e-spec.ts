import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/databse.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';

import { Test } from '@nestjs/testing';

import request from 'supertest';

describe('Create Admin (E2E)', () => {
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

  test('[POST] /create/admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/create/admin')
      .send({
        name: 'john Doe',
        email: 'johnDoe@email.com',
        password: '123123',
      });
    expect(response.statusCode).toBe(201);

    const admin = await prisma.admin.findFirst({
      where: {
        email: 'johnDoe@email.com',
      },
    });
    expect(admin.email).toBe('johnDoe@email.com');

    const author = await prisma.author.findFirst({
      where: {
        userId: admin.id,
      },
    });
    expect(author.userId).toBe(admin.id);
  });
});
