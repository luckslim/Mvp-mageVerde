import { left, right, type Either } from '@/core/either';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import type { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import type { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';

interface DeleteEventUseCaseRequest {
  id: string; //id from event
  userId: string;
}
type DeleteEventUseCaseResponse = Either<
  userAlreadyExistError,
  { event: Event }
>;
export class DeleteEventUseCase {
  constructor(public eventRepository: EventRepository) {}
  async execute({
    id,
    userId,
  }: DeleteEventUseCaseRequest): Promise<DeleteEventUseCaseResponse> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      return left(new WrongcredentialError());
    }
    if (event.authorId !== userId) {
      return left(new WrongcredentialError());
    } else {
      await this.eventRepository.delete(id);
      return right({ event });
    }
  }
}
