import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EditAnswerUseCase } from './edit-answer';
import { InMemoryAnswerRepository } from '../../../../../../test/repository/in-memory-answer-repository';
import { makeAnswer } from '../../../../../../test/factory/make-answer-factory';

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: EditAnswerUseCase;
describe('edit answers', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new EditAnswerUseCase(inMemoryAnswerRepository);
  });
  it('should be able edit answers', async () => {
    for (let i = 0; i < 10; i++) {
      const answer = makeAnswer();
      inMemoryAnswerRepository.items.push(answer);
    }
    const answerSelected = makeAnswer();
    inMemoryAnswerRepository.items.push(answerSelected);
    const result = await sut.execute({
      id: answerSelected.id.toString(),
      authorId: answerSelected.authorId,
      content: 'new content',
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerRepository.items).toHaveLength(11);
    expect(result.value).toMatchObject({
      answer: {
        props: {
          content: 'new content',
        },
      },
    });
  });
  it('should not be able edit answers with another authorId', async () => {
    for (let i = 0; i < 10; i++) {
      const answer = makeAnswer();
      inMemoryAnswerRepository.items.push(answer);
    }
    const answerSelected = makeAnswer();
    inMemoryAnswerRepository.items.push(answerSelected);
    const result = await sut.execute({
      id: answerSelected.id.toString(),
      authorId: new UniqueEntityID().toString(),
      content: 'new content',
    });
    expect(result.isLeft()).toBe(true);
  });
});
