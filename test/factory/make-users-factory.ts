import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, type userProps } from "@/domain/enterprise/entities/user";

export function makeUsers(
  override: Partial<userProps> = {},
  id?: UniqueEntityID
) {
  const user = User.create(
    {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
      ...override,
    },
    id
  );
  return user;
}
