import { left, right, type Either } from '@/core/either';
import { Events } from '@/domain/enterprise/entities/events';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import type { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import type { EventsRepository } from '../../repositories/event-repository';

interface DeleteEventsUseCaseRequest {
  id: string; //id from event
  userId: string;
}
type DeleteEventsUseCaseResponse = Either<
  userAlreadyExistError,
  { event: Events }
>;
export class DeleteEventsUseCase {
  constructor(public eventsRepository: EventsRepository) {}
  async execute({
    id,
    userId,
  }: DeleteEventsUseCaseRequest): Promise<DeleteEventsUseCaseResponse> {
    const event = await this.eventsRepository.findById(id);
    if (!event) {
      return left(new WrongcredentialError());
    }
    if (event.authorId !== userId) {
      return left(new WrongcredentialError());
    } else {
      await this.eventsRepository.delete(id);
      return right({ event });
    }
  }
}
