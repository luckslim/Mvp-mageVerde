import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CreateAnswerUseCase } from './create-answer';
import { makeAnswer } from '../../../../../../test/factory/make-answer-factory';
import { InMemoryAnswerRepository } from '../../../../../../test/repository/in-memory-answer-repository';
import { InMemoryQuestionRepository } from '../../../../../../test/repository/in-memory-question-repository';
import { makeQuestion } from '../../../../../../test/factory/make-question-factory';
import { QuestionAreNotExitsError } from '@/core/errors/question-is-not-exist-error';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: CreateAnswerUseCase;
describe('Create answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new CreateAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryQuestionRepository,
    );
  });
  it('should be able create answer', async () => {
    const answer = makeAnswer();
    const question = makeQuestion();
    inMemoryQuestionRepository.items.push(question);
    inMemoryAnswerRepository.items.push(answer);
    const result = await sut.execute({
      id: question.id.toString(),
      authorId: answer.authorId,
      content: answer.content,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerRepository.items).toHaveLength(1);
    expect(result.value).toMatchObject({
      answer: {
        authorId: answer.authorId,
        content: answer.content,
      },
    });
  });
  it('should not be able create answer with another id', async () => {
    const answer = makeAnswer();
    const question = makeQuestion();
    inMemoryQuestionRepository.items.push(question);
    inMemoryAnswerRepository.items.push(answer);
    const result = await sut.execute({
      id: new UniqueEntityID('any').toString(),
      authorId: answer.authorId,
      content: answer.content,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(QuestionAreNotExitsError);
  });
});
