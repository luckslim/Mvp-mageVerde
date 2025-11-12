import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EventAreNotExitsError } from '@/core/errors/event-are-not-exist-error';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionRepository } from '../../../../../../test/repository/in-memory-question-repository';
import { makeQuestion } from '../../../../../../test/factory/make-question-factory';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { makeEvent } from 'test/factory/make-events-factory';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryEventRepository: InMemoryEventRepository;
let sut: CreateQuestionUseCase;
describe('Create question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    inMemoryEventRepository = new InMemoryEventRepository();
    sut = new CreateQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryEventRepository,
    );
  });
  it('should be able create question', async () => {
    const question = makeQuestion();
    const event = makeEvent();
    inMemoryEventRepository.items.push(event);
    inMemoryQuestionRepository.items.push(question);
    const result = await sut.execute({
      id: event.id.toString(),
      authorId: question.authorId,
      content: question.content,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionRepository.items).toHaveLength(1);
    expect(result.value).toMatchObject({
      question: {
        authorId: question.authorId,
        content: question.content,
      },
    });
  });
  it('should not be able create question with another id', async () => {
    const question = makeQuestion();
    const event = makeEvent();
    inMemoryEventRepository.items.push(event);
    inMemoryQuestionRepository.items.push(question);
    const result = await sut.execute({
      id: new UniqueEntityID('any').toString(),
      authorId: question.authorId,
      content: question.content,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EventAreNotExitsError);
  });
});
