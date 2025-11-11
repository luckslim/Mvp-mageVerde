import { UserRepository } from '@/domain/aplication/repositories/user-repository';
import { User } from '@/domain/enterprise/entities/user';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data,
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    return PrismaUserMapper.toDomain(user);
  }
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    return PrismaUserMapper.toDomain(user);
  }
  async save(user: User): Promise<User | null> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
    return user;
  }
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
