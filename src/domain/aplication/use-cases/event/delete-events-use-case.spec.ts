import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeleteEventsUseCase } from './delete-events-use-case';
import { InMemoryEventsRepository } from '../../../../../test/repository/in-memory-events-repository';
import { makeEvent } from '../../../../../test/factory/make-events-factory';

let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: DeleteEventsUseCase;
describe('delete events', () => {
  beforeEach(() => {
    inMemoryEventsRepository = new InMemoryEventsRepository();
    sut = new DeleteEventsUseCase(inMemoryEventsRepository);
  });
  it('should be able delete event', async () => {
    for (let i = 0; i < 10; i++) {
      const events = makeEvent();
      inMemoryEventsRepository.items.push(events);
    }
    const eventsSelected = makeEvent();
    inMemoryEventsRepository.items.push(eventsSelected);
    const result = await sut.execute({
      id: eventsSelected.id.toString(),
      userId: eventsSelected.authorId,
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryEventsRepository.items).toHaveLength(10);
  });
  it('should not be able delete events with any email', async () => {
    for (let i = 0; i < 10; i++) {
      const events = makeEvent();
      inMemoryEventsRepository.items.push(events);
    }
    const eventsSelected = makeEvent();
    inMemoryEventsRepository.items.push(eventsSelected);
    const result = await sut.execute({
      id: eventsSelected.id.toString(),
      userId: new UniqueEntityID().toString(),
    });
    expect(result.isLeft()).toBe(true);
  });
});
