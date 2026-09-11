import { Inject, Injectable } from '@nestjs/common';
import { EventRepository } from '../../repositories/event-repository';
import {
  Event,
  EventStatus,
} from '@/domain/enterprise/entities/events';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { left, right, type Either } from '@/core/either';

interface ModerateEventUseCaseRequest {
  eventId: string;
  status: EventStatus.APPROVED | EventStatus.REJECTED;
}

type ModerateEventUseCaseResponse = Either<
  ResourceNotFoundError,
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

    event.status = status;
    const savedEvent = await this.eventRepository.save(event);

    return right({ event: savedEvent ?? event });
  }
}
