import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { makeEvent } from 'test/factory/make-events-factory';
import { GetMyEventsUseCase } from './get-my-events-use-case';

describe('get my events', () => {
  it('should return only events created by the requested author', async () => {
    const repository = new InMemoryEventRepository();
    const ownEvent = makeEvent({ authorId: 'author-a' });
    const otherEvent = makeEvent({ authorId: 'author-b' });
    repository.items.push(ownEvent, otherEvent);
    const sut = new GetMyEventsUseCase(repository);

    const events = await sut.execute('author-a');

    expect(events).toEqual([ownEvent]);
  });
});
