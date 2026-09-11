import { Inject, Injectable } from '@nestjs/common';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';

@Injectable()
export class GetAllEventsUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
  ) {}

  async execute(): Promise<Event[]> {
    return (await this.eventRepository.findByAll()) ?? [];
  }
}
