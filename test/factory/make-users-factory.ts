import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User, type userProps } from '@/domain/enterprise/entities/user';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { Injectable } from '@nestjs/common';

export function makeUsers(
  override: Partial<userProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
      ...override,
    },
    id,
  );
  return user;
}
@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaUser(data: Partial<userProps>): Promise<User> {
    const user = makeUsers(data);
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
    return user;
  }
}
