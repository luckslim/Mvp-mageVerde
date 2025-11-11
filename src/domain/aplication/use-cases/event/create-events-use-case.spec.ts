import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { makeEvent } from '../../../../../test/factory/make-events-factory';
import { InMemoryEventsRepository } from '../../../../../test/repository/in-memory-events-repository';
import { CreateEventsUseCase } from './create-events-use-case';
import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';

let inMemoryEventsRepository: InMemoryEventsRepository;
let fakeHasher: FakeHasher;
let sut: CreateEventsUseCase;
describe('Create events', () => {
  beforeEach(() => {
    inMemoryEventsRepository = new InMemoryEventsRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateEventsUseCase(inMemoryEventsRepository);
  });
  it('should be able create events', async () => {
    const events = makeEvent();
    const result = await sut.execute({
      authorId: events.authorId,
      title: events.title,
      content: events.content,
      time: events.time,
      colaborators: events.colaborators,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      events: {
        authorId: events.authorId,
        title: events.title,
        content: events.content,
        time: events.time,
        colaborators: events.colaborators,
      },
    });
  });
  it('should be able create events', async () => {
    const events = makeEvent();
    inMemoryEventsRepository.items.push(events);
    const result = await sut.execute({
      authorId: events.authorId,
      title: events.title,
      content: events.content,
      time: events.time,
      colaborators: events.colaborators,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(TitleAlreadyExistError);
  });
});
