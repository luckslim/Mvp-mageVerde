import { left, right, type Either } from '@/core/either';
import { EventRepository } from '../../repositories/event-repository';
import { Event } from '@/domain/enterprise/entities/events';
import { Inject, Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { UploadRepository } from '../../repositories/upload-repository';

interface DeleteEventUseCaseRequest {
  eventId: string; //id from event
  Id: string; //id from user
}
type DeleteEventUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { event: Event }
>;
@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
    @Inject(UploadRepository) public uploadRepository: UploadRepository,
  ) {}
  async execute({
    Id,
    eventId,
  }: DeleteEventUseCaseRequest): Promise<DeleteEventUseCaseResponse> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      return left(new ResourceNotFoundError());
    }

    if (event.authorId != Id) {
      return left(new NotAllowedError());
    }

    this.eventRepository.delete(eventId);

    this.uploadRepository.deleteUpload(event.fileUrl);

    return right({ event });
  }
}
