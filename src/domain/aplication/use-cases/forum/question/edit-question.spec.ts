import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EditQuestionUseCase } from './edit-question';
import { InMemoryQuestionRepository } from '../../../../../../test/repository/in-memory-question-repository';
import { makeQuestion } from '../../../../../../test/factory/make-question-factory';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: EditQuestionUseCase;
describe('edit questions', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionRepository);
  });
  it('should be able edit questions', async () => {
    for (let i = 0; i < 10; i++) {
      const question = makeQuestion();
      inMemoryQuestionRepository.items.push(question);
    }
    const questionSelected = makeQuestion();
    inMemoryQuestionRepository.items.push(questionSelected);
    const result = await sut.execute({
      id: questionSelected.id.toString(),
      authorId: questionSelected.authorId,
      content: 'new content',
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionRepository.items).toHaveLength(11);
    expect(result.value).toMatchObject({
      question: {
        props: {
          content: 'new content',
        },
      },
    });
  });
  it('should not be able edit questions with another authorId', async () => {
    for (let i = 0; i < 10; i++) {
      const question = makeQuestion();
      inMemoryQuestionRepository.items.push(question);
    }
    const questionSelected = makeQuestion();
    inMemoryQuestionRepository.items.push(questionSelected);
    const result = await sut.execute({
      id: questionSelected.id.toString(),
      authorId: new UniqueEntityID().toString(),
      content: 'new content',
    });
    expect(result.isLeft()).toBe(true);
  });
});
