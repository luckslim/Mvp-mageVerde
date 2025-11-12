import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Event } from '@/domain/enterprise/entities/events';
import type { Event as PrismaEvent } from '@prisma/client';

export class PrismaEventMapper {
  static toDomain(raw: PrismaEvent): Event {
    return Event.create(
      {
        authorId: raw.authorId,
        title: raw.title,
        content: raw.content,
        colaborators: raw.colaborators,
        time: raw.time,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(event: Event): PrismaEvent {
    return {
      id: event.id.toString(),
      authorId: event.authorId,
      title: event.title,
      content: event.content,
      colaborators: event.colaborators,
      time: event.time,
    };
  }
}
