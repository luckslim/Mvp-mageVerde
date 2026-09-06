import { left, right, type Either } from '@/core/either';
import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';
import { Inject, Injectable } from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UploadRepository } from '../../repositories/upload-repository';
import { Upload } from '@/domain/enterprise/entities/upload';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';

interface CreateEventUseCaseRequest {
  Id: string; //id from user, got from jwt
  title: string;
  content: string;
  time: string;
  colaborators: string;
  body: string;
}
type CreateEventUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { event: Event }
>;
@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
    @Inject(UploadRepository) public UploadRepository: UploadRepository,
  ) {}
  async execute({
    Id,
    title,
    content,
    time,
    colaborators,
    body,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const eventTitle = await this.eventRepository.findByTitle(title);

    if (eventTitle) {
      return left(new TitleAlreadyExistError(eventTitle.title));
    } else {
      const event = Event.create({
        authorId: Id,
        title,
        content,
        time,
        colaborators,
      });

      await this.eventRepository.create(event);

      if (body == null) {
        return left(new ResourceNotFoundError());
      }

      const imageFile = readFileSync(body);

      const fileName = `${randomUUID()}-${title}-${Id}`;

      const file = Upload.create({
        body: imageFile,
        fileName,
        userId: Id,
      });

      await this.UploadRepository.upload(file);

      return right({ event });
    }
  }
}
