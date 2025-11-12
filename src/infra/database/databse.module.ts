import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from '@/domain/aplication/repositories/user-repository';
import { PrismaUserRepository } from './prisma/repository/prisma-user-repository';
import { AdminRepository } from '@/domain/aplication/repositories/admin-repository';
import { PrismaAdminRepository } from './prisma/repository/prisma-admin-repository';
import { PrismaEventRepository } from './prisma/repository/prisma-event-repository';
import { EventRepository } from '@/domain/aplication/repositories/event-repository';

@Module({
  providers: [
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: AdminRepository, useClass: PrismaAdminRepository },
    { provide: EventRepository, useClass: PrismaEventRepository },
  ],
  exports: [PrismaService, UserRepository, AdminRepository, EventRepository],
})
export class DatabaseModule {}
