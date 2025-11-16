import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { DeleteEventUseCase } from './delete-events-use-case';
import { makeEvent } from 'test/factory/make-events-factory';
import { InMemoryAuthorRepository } from 'test/repository/in-memory-author-repository';
import { makeAuthor } from 'test/factory/make-author-factory';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryEventRepository: InMemoryEventRepository;
let inMemoryAuthorRepository: InMemoryAuthorRepository;
let sut: DeleteEventUseCase;
describe('delete event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    inMemoryAuthorRepository = new InMemoryAuthorRepository();
    sut = new DeleteEventUseCase(
      inMemoryEventRepository,
      inMemoryAuthorRepository,
    );
  });
  it('should be able delete an event', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }
    const authorSelected = makeAuthor();
    inMemoryAuthorRepository.items.push(authorSelected);

    const eventSelected = makeEvent({
      authorId: authorSelected.authorId,
    });
    inMemoryEventRepository.items.push(eventSelected);

    const result = await sut.execute({
      Id: authorSelected.authorId,
      eventId: eventSelected.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryEventRepository.items).toHaveLength(10);
  });
  it('should not be able delete event with any ID', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }
    const eventSelected = makeEvent();
    inMemoryEventRepository.items.push(eventSelected);
    const result = await sut.execute({
      Id: new UniqueEntityID().toString(),
      eventId: eventSelected.id.toString(),
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceof(ResourceNotFoundError);
  });
});
