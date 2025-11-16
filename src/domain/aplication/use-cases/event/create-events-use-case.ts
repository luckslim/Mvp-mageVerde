import { left, right, type Either } from '@/core/either';
import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';
import { Inject, Injectable } from '@nestjs/common';
import { AuthorRepository } from '../../repositories/author-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface CreateEventUseCaseRequest {
  Id: string; //id from user, got from jwt
  title: string;
  content: string;
  time: string;
  colaborators: string;
}
type CreateEventUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { event: Event }
>;
@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
    @Inject(AuthorRepository) public authorRepository: AuthorRepository,
  ) {}
  async execute({
    Id,
    title,
    content,
    time,
    colaborators,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const author = await this.authorRepository.findById(Id);
    if (!author) {
      return left(new ResourceNotFoundError());
    }
    if (author.typeUser !== 'ADMIN') {
      return left(new NotAllowedError());
    }

    const eventTitle = await this.eventRepository.findByTitle(title);

    if (eventTitle) {
      return left(new TitleAlreadyExistError(eventTitle.title));
    } else {
      const event = Event.create({
        authorId: author.authorId,
        title,
        content,
        time,
        colaborators,
      });

      await this.eventRepository.create(event);

      return right({ event });
    }
  }
}
