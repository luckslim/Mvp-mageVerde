import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface EditEventUseCaseRequest {
  Id: string; //id from admin
  eventId: string;
  title: string;
  content: string;
  time: string;
  colaborators: string;
}
type EditEventUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { event: Event }
>;
export class EditEventUseCase {
  constructor(public eventRepository: EventRepository) {}
  async execute({
    Id,
    eventId,
    title,
    content,
    time,
    colaborators,
  }: EditEventUseCaseRequest): Promise<EditEventUseCaseResponse> {
    const event = await this.eventRepository.findById(eventId);
    if (Id != event?.authorId) {
      return left(new NotAllowedError());
    } else {
      event.title = title;
      event.content = content;
      event.time = time;
      event.colaborators = colaborators;
      this.eventRepository.save(event);
      return right({ event });
    }
  }
}
