import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { EditEventUseCase } from './edit-events-use-case';
import { makeEvent } from 'test/factory/make-events-factory';

let inMemoryEventRepository: InMemoryEventRepository;
let sut: EditEventUseCase;
describe('adit event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    sut = new EditEventUseCase(inMemoryEventRepository);
  });
  it('should be able edit event', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }

    const eventSelected = makeEvent({
      authorId: new UniqueEntityID().toString(),
    });
    inMemoryEventRepository.items.push(eventSelected);
    const result = await sut.execute({
      Id: eventSelected.authorId,
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

  it('should return not found when the event does not exist', async () => {
    const result = await sut.execute({
      Id: new UniqueEntityID().toString(),
      eventId: 'missing-event',
      title: 'New Title',
      content: 'new content, hello world!',
      colaborators: 'new colaboration',
      time: '11h:30m',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
