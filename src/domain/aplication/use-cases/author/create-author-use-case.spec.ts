import { makeAuthor } from 'test/factory/make-author-factory';
import { CreateAuthorUseCase } from './create-author-use-case';
import { InMemoryAuthorRepository } from 'test/repository/in-memory-author-repository';

let inMemoryAuthorRepository: InMemoryAuthorRepository;
let sut: CreateAuthorUseCase;
describe('Create author', () => {
  beforeEach(() => {
    inMemoryAuthorRepository = new InMemoryAuthorRepository();
    sut = new CreateAuthorUseCase(inMemoryAuthorRepository);
  });
  it('should be able create author', async () => {
    const author = makeAuthor();
    const result = await sut.execute({
      typeUser: author.typeUser,
      authorId: author.authorId,
      eventId: author.eventId,
      questionId: author.questionId,
      answerId: author.answerId,
    });
    expect(result.isRight()).toBe(true);
  });
});
