import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from '@/domain/aplication/repositories/user-repository';
import { PrismaUserRepository } from './prisma/repository/prisma-user-repository';

@Module({
  providers: [
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [PrismaService, UserRepository],
})
export class DatabaseModule {}
