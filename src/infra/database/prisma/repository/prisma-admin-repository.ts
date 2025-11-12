import { AdminRepository } from '@/domain/aplication/repositories/admin-repository';
import { Admin } from '@/domain/enterprise/entities/admin';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper';

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin);
    await this.prisma.admin.create({
      data,
    });
  }
  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!admin) {
      return null;
    }
    return PrismaAdminMapper.toDomain(admin);
  }
  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        id,
      },
    });
    return PrismaAdminMapper.toDomain(admin);
  }
  async save(admin: Admin): Promise<Admin | null> {
    const data = PrismaAdminMapper.toPrisma(admin);
    await this.prisma.admin.update({
      where: {
        id: data.id,
      },
      data,
    });
    return admin;
  }
  async delete(id: string): Promise<void> {
    await this.prisma.admin.delete({
      where: {
        id,
      },
    });
  }
}
