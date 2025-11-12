import { EventRepository } from '@/domain/aplication/repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';

export class InMemoryEventRepository implements EventRepository {
  public items: Event[] = [];
  async findById(id: string): Promise<Event | null> {
    const event = this.items.find((item) => item.id.toString() === id);
    if (!event) {
      return null;
    }
    return event;
  }
  async findByAll(): Promise<Event[] | null> {
    const event = this.items;
    return event;
  }
  async create(event: Event) {
    this.items.push(event);
  }
  async findByTitle(title: string): Promise<Event | null> {
    const event = this.items.find((item) => item.title === title);
    if (!event) {
      return null;
    }
    return event;
  }
  async save(event: Event): Promise<Event | null> {
    const itemIndex = this.items.findIndex((item) => item.id === event.id);
    this.items[itemIndex] = event;
    return event;
  }
  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id);
    this.items.splice(itemIndex, 1);
  }
}
