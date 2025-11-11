import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question, type questionProps } from "@/domain/enterprise/entities/questions";
export function makeQuestion(
  override: Partial<questionProps> = {},
  id?: UniqueEntityID
) {
  const questions = Question.create(
    {
      authorId: faker.string.uuid(),
      content: faker.lorem.text(),
      createdAt: new Date,
      ...override,
    },
    id
  );
  return questions;
}
