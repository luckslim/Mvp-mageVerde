import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { DeleteEventUseCase } from './delete-events-use-case';
import { makeEvent } from 'test/factory/make-events-factory';

let inMemoryEventRepository: InMemoryEventRepository;
let sut: DeleteEventUseCase;
describe('delete event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    sut = new DeleteEventUseCase(inMemoryEventRepository);
  });
  it('should be able delete event', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }
    const eventSelected = makeEvent();
    inMemoryEventRepository.items.push(eventSelected);
    const result = await sut.execute({
      id: eventSelected.id.toString(),
      userId: eventSelected.authorId,
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryEventRepository.items).toHaveLength(10);
  });
  it('should not be able delete event with any email', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }
    const eventSelected = makeEvent();
    inMemoryEventRepository.items.push(eventSelected);
    const result = await sut.execute({
      id: eventSelected.id.toString(),
      userId: new UniqueEntityID().toString(),
    });
    expect(result.isLeft()).toBe(true);
  });
});
