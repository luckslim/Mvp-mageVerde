import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DeleteQuestionUseCase } from './delete-question';
import { makeQuestion } from '../../../../../../test/factory/make-question-factory';
import { InMemoryQuestionRepository } from '../../../../../../test/repository/in-memory-question-repository';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: DeleteQuestionUseCase;
describe('delete questions', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository);
  });
  it('should be able delete question', async () => {
    for (let i = 0; i < 10; i++) {
      const question = makeQuestion();
      inMemoryQuestionRepository.items.push(question);
    }
    const questionSelected = makeQuestion();
    inMemoryQuestionRepository.items.push(questionSelected);
    const result = await sut.execute({
      id: questionSelected.id.toString(),
      authorId: questionSelected.authorId,
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionRepository.items).toHaveLength(10);
  });
  it('should not be able delete question with any id', async () => {
    for (let i = 0; i < 10; i++) {
      const question = makeQuestion();
      inMemoryQuestionRepository.items.push(question);
    }
    const questionSelected = makeQuestion();
    inMemoryQuestionRepository.items.push(questionSelected);
    const result = await sut.execute({
      id: questionSelected.id.toString(),
      authorId: new UniqueEntityID().toString(),
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
