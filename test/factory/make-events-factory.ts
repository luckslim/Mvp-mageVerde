import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Event, eventProps } from '@/domain/enterprise/entities/events';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaEventMapper } from '@/infra/database/prisma/mappers/prisma-event-mapper';
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
      time: faker.word.noun(),
      ...override,
    },
    id,
  );
  return event;
}
@Injectable()
export class EventFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaEvent(data: Partial<eventProps>): Promise<Event> {
    const event = makeEvent(data);
    await this.prisma.event.create({
      data: PrismaEventMapper.toPrisma(event),
    });
    return event;
  }
}
