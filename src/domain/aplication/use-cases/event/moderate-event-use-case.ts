import { Inject, Injectable } from '@nestjs/common';
import { EventRepository } from '../../repositories/event-repository';
import {
  Event,
  EventStatus,
} from '@/domain/enterprise/entities/events';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { EventAlreadyModeratedError } from '@/core/errors/event-already-moderated-error';
import { left, right, type Either } from '@/core/either';

interface ModerateEventUseCaseRequest {
  eventId: string;
  status: EventStatus.APPROVED | EventStatus.REJECTED;
}

type ModerateEventUseCaseResponse = Either<
  ResourceNotFoundError | EventAlreadyModeratedError,
  { event: Event }
>;

@Injectable()
export class ModerateEventUseCase {
  constructor(
    @Inject(EventRepository) public eventRepository: EventRepository,
  ) {}

  async execute({
    eventId,
    status,
  }: ModerateEventUseCaseRequest): Promise<ModerateEventUseCaseResponse> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      return left(new ResourceNotFoundError());
    }

    if (event.status !== EventStatus.PENDING) {
      return left(new EventAlreadyModeratedError());
    }

    event.status = status;
    const savedEvent = await this.eventRepository.save(event);

    return right({ event: savedEvent ?? event });
  }
}
