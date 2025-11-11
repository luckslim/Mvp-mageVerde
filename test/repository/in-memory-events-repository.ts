import type { EventsRepository } from "@/domain/aplication/repositories/event-repository";
import type { Events } from "@/domain/enterprise/entities/events";

export class InMemoryEventsRepository implements EventsRepository {
  public items: Events[] = [];
  async findById(id: string): Promise<Events | null> {
    const event =  this.items.find((item)=> item.id.toString() === id)
    if(!event){
      return null
    }
    return event
  }
  async findByAll(): Promise<Events[] | null> {
    const event = this.items
    return event
  }
  async create(events: Events){
    const event = this.items.push(events)
  }
  async findByTitle(title: string): Promise<Events | null> {
    const event = this.items.find((item)=> item.title === title)
    if(!event){
        return null
    }
    return event
  }
  async save(events: Events): Promise<Events | null> {
    const itemIndex = this.items.findIndex((item)=>item.id === events.id)
    this.items[itemIndex]=events
    return events
}
  async delete(id: string): Promise<void> {
    const itemIndex= this.items.findIndex((item)=>item.id.toString() === id)
    this.items.splice(itemIndex, 1)
  }
}
