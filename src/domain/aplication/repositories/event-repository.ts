import type { Events } from '@/domain/enterprise/entities/events';

export interface EventsRepository {
  create(events: Events): Promise<void>;
  findByTitle(title: string): Promise<Events | null>;
  findById(id: string): Promise<Events | null>;
  findByAll(): Promise<Events[] | null>;
  save(events: Events): Promise<Events | null>;
  delete(id: string): Promise<void>;
}
