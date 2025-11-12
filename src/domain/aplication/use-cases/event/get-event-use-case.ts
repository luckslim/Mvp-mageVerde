import { left, right, type Either } from '@/core/either';
import type { EventRepository } from '../../repositories/event-repository';
import { EventAreNotExitsError } from '@/core/errors/event-are-not-exist-error';
import { Event } from '@/domain/enterprise/entities/events';

type GetEventUseCaseResponse = Either<
  EventAreNotExitsError,
  { event: Event[] }
>;
export class GetEventUseCase {
  constructor(public eventRepository: EventRepository) {}
  async execute(): Promise<GetEventUseCaseResponse> {
    const event = await this.eventRepository.findByAll();
    if (!event) {
      return left(new EventAreNotExitsError());
    }
    return right({ event });
  }
}
