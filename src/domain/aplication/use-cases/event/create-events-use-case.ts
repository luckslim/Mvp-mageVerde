import { left, right, type Either } from '@/core/either';
import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';
import { Inject, Injectable } from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UploadRepository } from '../../repositories/upload-repository';
import { Upload } from '@/domain/enterprise/entities/upload';

interface CreateEventUseCaseRequest {
  Id: string; //id from user, got from jwt
  title: string;
  content: string;
  time: string;
  colaborators: string;
  body: Buffer;
  mimeType: string;
}
type CreateEventUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    event: Event;
    upload: {
      result: string;
    };
  }
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
    mimeType,
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
        fileUrl: 'Undefined',
      });

      await this.eventRepository.create(event);

      if (body == null) {
        return left(new ResourceNotFoundError());
      }

      const file = Upload.create({
        body,
        fileName: event.id.toString(),
        userId: Id,
        mimeType,
      });

      const upload = await this.UploadRepository.upload(file);

      event.fileUrl = upload.result;

      await this.eventRepository.save(event);

      return right({ event, upload });
    }
  }
}
