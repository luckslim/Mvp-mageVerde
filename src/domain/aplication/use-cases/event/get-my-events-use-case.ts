import { Inject, Injectable } from '@nestjs/common';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';

@Injectable()
export class GetMyEventsUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
  ) {}

  async execute(authorId: string): Promise<Event[]> {
    return (await this.eventRepository.findByAuthorId(authorId)) ?? [];
  }
}
