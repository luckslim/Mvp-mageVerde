import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Admin, type adminProps } from '@/domain/enterprise/entities/admin';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper';

export function makeAdmins(
  override: Partial<adminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
      ...override,
    },
    id,
  );
  return admin;
}
@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaAdmin(data: Partial<adminProps>): Promise<Admin> {
    const admin = makeAdmins(data);
    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrisma(admin),
    });
    return admin;
  }
}
