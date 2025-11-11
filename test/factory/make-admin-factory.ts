import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Admin, type adminProps } from "@/domain/enterprise/entities/admin";

export function makeAdmins(
  override: Partial<adminProps> = {},
  id?: UniqueEntityID
) {
  const admin = Admin.create(
    {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
      ...override,
    },
    id
  );
  return admin;
}
