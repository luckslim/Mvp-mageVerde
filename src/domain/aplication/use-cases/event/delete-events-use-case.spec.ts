import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { DeleteEventUseCase } from './delete-events-use-case';
import { makeEvent } from 'test/factory/make-events-factory';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InMemoryUploadRepository } from 'test/repository/in-memory-upload-repository';

let inMemoryEventRepository: InMemoryEventRepository;
let inMemoryUploadRepository: InMemoryUploadRepository;
let sut: DeleteEventUseCase;
describe('delete event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    inMemoryUploadRepository = new InMemoryUploadRepository();
    sut = new DeleteEventUseCase(
      inMemoryEventRepository,
      inMemoryUploadRepository,
    );
  });

  it('should be able delete an event', async () => {
    for (let i = 0; i < 10; i++) {
      const event = makeEvent();
      inMemoryEventRepository.items.push(event);
    }

    const eventSelected = makeEvent({
      authorId: UniqueEntityID.toString(),
    });
    inMemoryEventRepository.items.push(eventSelected);

    const result = await sut.execute({
      Id: eventSelected.authorId,
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
    expect(result.value).instanceof(NotAllowedError);
  });
});
