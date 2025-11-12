import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { Admin as PrismaAdmin } from '@prisma/client';
import { Admin } from '@/domain/enterprise/entities/admin';

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(admin: Admin): PrismaAdmin {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
    };
  }
}
