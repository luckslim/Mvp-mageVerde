import { left, right, type Either } from '@/core/either';
import { EventRepository } from '../../repositories/event-repository';
import { EventAreNotExitsError } from '@/core/errors/event-are-not-exist-error';
import { Event, EventStatus } from '@/domain/enterprise/entities/events';
import { Inject, Injectable } from '@nestjs/common';

type GetEventUseCaseResponse = Either<
  EventAreNotExitsError,
  { event: Event[] }
>;
@Injectable()
export class GetEventUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
  ) {}
  async execute(): Promise<GetEventUseCaseResponse> {
    const event = await this.eventRepository.findByAll(EventStatus.APPROVED);
    if (!event) {
      return left(new EventAreNotExitsError());
    }
    return right({ event });
  }
}
