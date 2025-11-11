import { left, right, type Either } from '@/core/either';
import { Events } from '@/domain/enterprise/entities/events';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';
import type { EventsRepository } from '../../repositories/event-repository';
import { EventAreNotExitsError } from '@/core/errors/event-are-not-exist-error';

type GetEventsUseCaseResponse = Either<
  EventAreNotExitsError,
  { events: Events[] }
>;
export class GetEventsUseCase {
  constructor(public eventsRepository: EventsRepository) {}
  async execute(): Promise<GetEventsUseCaseResponse> {
    const events = await this.eventsRepository.findByAll();
    if (!events) {
      return left(new EventAreNotExitsError());
    }
    return right({ events });
  }
}
