import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Event, EventStatus } from '@/domain/enterprise/entities/events';
import type { Event as PrismaEvent } from '@prisma/client';

export class PrismaEventMapper {
  static toDomain(raw: PrismaEvent): Event {
    return Event.create(
      {
        authorId: raw.authorId,
        title: raw.title,
        content: raw.content,
        colaborators: raw.colaborators,
        fileUrl: raw.fileUrl,
        time: raw.time,
        date: raw.date,
        location: raw.location,
        status: raw.status as EventStatus,
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
      fileUrl: event.fileUrl,
      colaborators: event.colaborators,
      time: event.time,
      date: event.date,
      location: event.location,
      status: event.status,
    };
  }
}
