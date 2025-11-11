import { left, right, type Either } from '@/core/either';
import { Answer } from '@/domain/enterprise/entities/answers';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { EventAreNotExitsError } from '@/core/errors/event-are-not-exist-error';
import type { EventsRepository } from '@/domain/aplication/repositories/event-repository';
import type { AnswerRepository } from '@/domain/aplication/repositories/answer-repository';
import type { QuestionRepository } from '@/domain/aplication/repositories/question-repository';
import { QuestionAreNotExitsError } from '@/core/errors/question-is-not-exist-error';

interface CreateAnswerUseCaseRequest {
  id: string; //id from question
  authorId: string;
  content: string;
}
type CreateAnswerUseCaseResponse = Either<
  userAlreadyExistError | EventAreNotExitsError,
  { answer: Answer }
>;
export class CreateAnswerUseCase {
  constructor(
    public answerRepository: AnswerRepository,
    public questionRepository: QuestionRepository,
  ) {}
  async execute({
    id,
    authorId,
    content,
  }: CreateAnswerUseCaseRequest): Promise<CreateAnswerUseCaseResponse> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      return left(new QuestionAreNotExitsError());
    }
    const answer = Answer.create({
      authorId,
      content,
    });
    return right({ answer });
  }
}
