import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Events, type eventsProps } from "@/domain/enterprise/entities/events";
export function makeEvent(
  override: Partial<eventsProps> = {},
  id?: UniqueEntityID
) {
  const events = Events.create(
    {
      authorId: faker.string.uuid(),
      title: faker.string.sample(),
      content: faker.lorem.text(),
      colaborators: faker.word.noun(),
      time: faker.string.sample(), 
      ...override,
    },
    id
  );
  return events;
}
