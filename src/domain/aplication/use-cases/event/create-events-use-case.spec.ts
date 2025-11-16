import { CreateEventUseCase } from './create-events-use-case';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { makeEvent } from 'test/factory/make-events-factory';
import { InMemoryAuthorRepository } from 'test/repository/in-memory-author-repository';
import { makeAuthor } from 'test/factory/make-author-factory';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryEventRepository: InMemoryEventRepository;
let inMemoryAuthorRepository: InMemoryAuthorRepository;
let sut: CreateEventUseCase;
describe('Create event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    inMemoryAuthorRepository = new InMemoryAuthorRepository();
    sut = new CreateEventUseCase(
      inMemoryEventRepository,
      inMemoryAuthorRepository,
    );
  });
  it('should be able create event only with authorId(Admin)', async () => {
    const author = makeAuthor();
    inMemoryAuthorRepository.items.push(author);

    const event = makeEvent();

    const result = await sut.execute({
      Id: author.authorId,
      title: event.title,
      content: event.content,
      time: event.time,
      colaborators: event.colaborators,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      event: {
        authorId: author.authorId,
        title: event.title,
        content: event.content,
        time: event.time,
        colaborators: event.colaborators,
      },
    });
  });
  it('should not be able create event with another authorId(Admin)', async () => {
    const author = makeAuthor();
    inMemoryAuthorRepository.items.push(author);

    const event = makeEvent();
    const result = await sut.execute({
      Id: new UniqueEntityID().toString(),
      title: event.title,
      content: event.content,
      time: event.time,
      colaborators: event.colaborators,
    });
    expect(result.isLeft()).toBe(true);
  });
});
