import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DeleteAnswerUseCase } from './delete-answer';
import { makeAnswer } from '../../../../../../test/factory/make-answer-factory';
import { InMemoryAnswerRepository } from '../../../../../../test/repository/in-memory-answer-repository';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: DeleteAnswerUseCase;
describe('delete answers', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository);
  });
  it('should be able delete answer', async () => {
    for (let i = 0; i < 10; i++) {
      const answer = makeAnswer();
      inMemoryAnswerRepository.items.push(answer);
    }
    const answerSelected = makeAnswer();
    inMemoryAnswerRepository.items.push(answerSelected);
    const result = await sut.execute({
      id: answerSelected.id.toString(),
      authorId: answerSelected.authorId,
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerRepository.items).toHaveLength(10);
  });
  it('should not be able delete answer with any id', async () => {
    for (let i = 0; i < 10; i++) {
      const answer = makeAnswer();
      inMemoryAnswerRepository.items.push(answer);
    }
    const answerSelected = makeAnswer();
    inMemoryAnswerRepository.items.push(answerSelected);
    const result = await sut.execute({
      id: answerSelected.id.toString(),
      authorId: new UniqueEntityID().toString(),
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
