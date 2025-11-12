import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Event, eventProps } from '@/domain/enterprise/entities/events';
export function makeEvent(
  override: Partial<eventProps> = {},
  id?: UniqueEntityID,
) {
  const event = Event.create(
    {
      authorId: faker.string.uuid(),
      title: faker.string.sample(),
      content: faker.lorem.text(),
      colaborators: faker.word.noun(),
      time: faker.string.sample(),
      ...override,
    },
    id,
  );
  return event;
}
