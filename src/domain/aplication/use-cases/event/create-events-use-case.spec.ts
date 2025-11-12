import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';
import { CreateEventUseCase } from './create-events-use-case';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { makeEvent } from 'test/factory/make-events-factory';

let inMemoryEventRepository: InMemoryEventRepository;
let sut: CreateEventUseCase;
describe('Create event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    sut = new CreateEventUseCase(inMemoryEventRepository);
  });
  it('should be able create event', async () => {
    const event = makeEvent();
    const result = await sut.execute({
      authorId: event.authorId,
      title: event.title,
      content: event.content,
      time: event.time,
      colaborators: event.colaborators,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      event: {
        authorId: event.authorId,
        title: event.title,
        content: event.content,
        time: event.time,
        colaborators: event.colaborators,
      },
    });
  });
  it('should be able create event', async () => {
    const event = makeEvent();
    inMemoryEventRepository.items.push(event);
    const result = await sut.execute({
      authorId: event.authorId,
      title: event.title,
      content: event.content,
      time: event.time,
      colaborators: event.colaborators,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(TitleAlreadyExistError);
  });
});
