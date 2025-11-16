import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { EditEventUseCase } from './edit-events-use-case';
import { makeEvent } from 'test/factory/make-events-factory';
import { InMemoryAuthorRepository } from 'test/repository/in-memory-author-repository';
import { makeAuthor } from 'test/factory/make-author-factory';

let inMemoryEventRepository: InMemoryEventRepository;
let inMemoryAuthorRepository: InMemoryAuthorRepository;
let sut: EditEventUseCase;
describe('adit event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    inMemoryAuthorRepository = new InMemoryAuthorRepository();
    sut = new EditEventUseCase(
      inMemoryEventRepository,
      inMemoryAuthorRepository,
    );
  });
  it('should be able edit event', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }
    const selectedAuthor = makeAuthor();
    inMemoryAuthorRepository.items.push(selectedAuthor);

    const eventSelected = makeEvent({
      authorId: selectedAuthor.authorId,
    });
    inMemoryEventRepository.items.push(eventSelected);
    const result = await sut.execute({
      Id: selectedAuthor.authorId,
      eventId: eventSelected.id.toString(),
      title: 'New Title',
      content: 'new content, hello world!',
      colaborators: 'new colaboration',
      time: '11h:30m',
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      event: {
        props: {
          title: 'New Title',
          content: 'new content, hello world!',
          colaborators: 'new colaboration',
          time: '11h:30m',
        },
      },
    });
  });
  it('should not be able edit event another Id', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }
    const eventSelected = makeEvent();
    inMemoryEventRepository.items.push(eventSelected);
    const result = await sut.execute({
      Id: new UniqueEntityID().toString(),
      eventId: new UniqueEntityID().toString(),
      title: 'New Title',
      content: 'new content, hello world!',
      colaborators: 'new colaboration',
      time: '11h:30m',
    });
    expect(result.isLeft()).toBe(true);
  });
});
