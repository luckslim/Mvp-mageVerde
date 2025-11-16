import { left, right, type Either } from '@/core/either';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';
import { Inject, Injectable } from '@nestjs/common';
import { AuthorRepository } from '../../repositories/author-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface DeleteEventUseCaseRequest {
  eventId: string; //id from event
  Id: string; //id from user, got from jwt
}
type DeleteEventUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { event: Event }
>;
@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
    @Inject(AuthorRepository) public authorRepository: AuthorRepository,
  ) {}
  async execute({
    Id,
    eventId,
  }: DeleteEventUseCaseRequest): Promise<DeleteEventUseCaseResponse> {
    const author = await this.authorRepository.findById(Id);

    if (!author) {
      return left(new ResourceNotFoundError());
    }
    if (author.typeUser !== 'ADMIN') {
      return left(new NotAllowedError());
    }

    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      return left(new ResourceNotFoundError());
    }

    if (author.authorId !== event.authorId) {
      return left(new NotAllowedError());
    }

    this.eventRepository.delete(eventId);

    return right({ event });
  }
}
