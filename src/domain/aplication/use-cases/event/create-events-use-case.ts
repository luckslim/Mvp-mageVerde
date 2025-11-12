import { left, right, type Either } from '@/core/either';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';
import { Inject, Injectable } from '@nestjs/common';

interface CreateEventUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  time: string;
  colaborators: string;
}
type CreateEventUseCaseResponse = Either<
  userAlreadyExistError,
  { event: Event }
>;
@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
  ) {}
  async execute({
    authorId,
    title,
    content,
    time,
    colaborators,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const eventTitle = await this.eventRepository.findByTitle(title);
    console.log(authorId);
    if (eventTitle) {
      return left(new TitleAlreadyExistError(eventTitle.title));
    } else {
      const event = Event.create({
        authorId,
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
