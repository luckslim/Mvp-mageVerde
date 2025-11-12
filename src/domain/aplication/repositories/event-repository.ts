import { Event } from '@/domain/enterprise/entities/events';

export abstract class EventRepository {
  abstract create(event: Event): Promise<void>;
  abstract findByTitle(title: string): Promise<Event | null>;
  abstract findById(id: string): Promise<Event | null>;
  abstract findByAll(): Promise<Event[] | null>;
  abstract save(event: Event): Promise<Event | null>;
  abstract delete(id: string): Promise<void>;
}
