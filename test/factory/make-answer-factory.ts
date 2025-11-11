import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer, type answerProps } from "@/domain/enterprise/entities/answers";
export function makeAnswer(
  override: Partial<answerProps> = {},
  id?: UniqueEntityID
) {
  const answers = Answer.create(
    {
      authorId: faker.string.uuid(),
      content: faker.lorem.text(),
      createdAt: new Date,
      ...override,
    },
    id
  );
  return answers;
}
