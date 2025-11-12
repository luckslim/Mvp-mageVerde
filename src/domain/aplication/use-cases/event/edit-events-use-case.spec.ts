import { UniqueEntityID } from '@/core/entities/unique-entity-id';
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
    const eventSelected = makeEvent();
    inMemoryEventRepository.items.push(eventSelected);
    const result = await sut.execute({
      id: eventSelected.id.toString(),
      userId: eventSelected.authorId,
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
  it('should not be able edit event another userId', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }
    const eventSelected = makeEvent();
    inMemoryEventRepository.items.push(eventSelected);
    const result = await sut.execute({
      id: eventSelected.id.toString(),
      userId: new UniqueEntityID().toString(),
      title: 'New Title',
      content: 'new content, hello world!',
      colaborators: 'new colaboration',
      time: '11h:30m',
    });
    expect(result.isLeft()).toBe(true);
  });
});
