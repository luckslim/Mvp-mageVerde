import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { makeEvent } from 'test/factory/make-events-factory';
import { EventStatus } from '@/domain/enterprise/entities/events';
import { ModerateEventUseCase } from './moderate-event-use-case';

describe('moderate event', () => {
  it('should publish an existing event', async () => {
    const repository = new InMemoryEventRepository();
    const event = makeEvent();
    repository.items.push(event);
    const sut = new ModerateEventUseCase(repository);

    const result = await sut.execute({
      eventId: event.id.toString(),
      status: EventStatus.APPROVED,
    });

    expect(result.isRight()).toBe(true);
    expect(event.status).toBe(EventStatus.APPROVED);
  });

  it('should reject moderation for a missing event', async () => {
    const repository = new InMemoryEventRepository();
    const sut = new ModerateEventUseCase(repository);

    const result = await sut.execute({
      eventId: 'missing-event',
      status: EventStatus.REJECTED,
    });

    expect(result.isLeft()).toBe(true);
  });
});
