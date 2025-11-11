import { left, right, type Either } from '@/core/either';
import { Events } from '@/domain/enterprise/entities/events';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';
import type { EventsRepository } from '../../repositories/event-repository';

interface CreateEventsUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  time: string;
  colaborators: string;
}
type CreateEventsUseCaseResponse = Either<
  userAlreadyExistError,
  { events: Events }
>;
export class CreateEventsUseCase {
  constructor(public eventsRepository: EventsRepository) {}
  async execute({
    authorId,
    title,
    content,
    time,
    colaborators,
  }: CreateEventsUseCaseRequest): Promise<CreateEventsUseCaseResponse> {
    const eventTitle = await this.eventsRepository.findByTitle(title);
    if (eventTitle) {
      return left(new TitleAlreadyExistError(eventTitle.title));
    } else {
      const events = Events.create({
        authorId,
        title,
        content,
        time,
        colaborators,
      });
      await this.eventsRepository.create(events);
      return right({ events });
    }
  }
}
