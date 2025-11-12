import { left, right, type Either } from '@/core/either';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';

interface EditEventUseCaseRequest {
  id: string;
  userId: string; //id from user that want delete
  title: string;
  content: string;
  time: string;
  colaborators: string;
}
type EditEventUseCaseResponse = Either<WrongcredentialError, { event: Event }>;
export class EditEventUseCase {
  constructor(public eventRepository: EventRepository) {}
  async execute({
    id,
    userId,
    title,
    content,
    time,
    colaborators,
  }: EditEventUseCaseRequest): Promise<EditEventUseCaseResponse> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      return left(new WrongcredentialError());
    }
    if (event.authorId !== userId) {
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
