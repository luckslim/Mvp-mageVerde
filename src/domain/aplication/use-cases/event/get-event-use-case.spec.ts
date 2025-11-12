import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { GetEventUseCase } from './get-event-use-case';
import { makeEvent } from 'test/factory/make-events-factory';

let inMemoryEventRepository: InMemoryEventRepository;
let sut: GetEventUseCase;
describe('Get event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    sut = new GetEventUseCase(inMemoryEventRepository);
  });
  it('should be able get event', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }
    const result = await sut.execute();
    expect(inMemoryEventRepository.items).toHaveLength(10);
    expect(result.isRight()).toBe(true);
  });
});
