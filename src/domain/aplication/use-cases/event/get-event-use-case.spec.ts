import { makeEvent } from '../../../../../test/factory/make-events-factory';
import { InMemoryEventsRepository } from '../../../../../test/repository/in-memory-events-repository';
import { GetEventsUseCase } from './get-event-use-case';

let inMemoryEventsRepository: InMemoryEventsRepository;
let sut: GetEventsUseCase;
describe('Get events', () => {
  beforeEach(() => {
    inMemoryEventsRepository = new InMemoryEventsRepository();
    sut = new GetEventsUseCase(inMemoryEventsRepository);
  });
  it('should be able get events', async () => {
    for (let i = 0; i < 10; i++) {
      const events = makeEvent();
      inMemoryEventsRepository.items.push(events);
    }
    const result = await sut.execute();
    expect(inMemoryEventsRepository.items).toHaveLength(10);
    expect(result.isRight()).toBe(true);
  });
});
