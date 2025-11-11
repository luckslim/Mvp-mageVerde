import { left, right, type Either } from '@/core/either';
import { QuestionAreNotExitsError } from '@/core/errors/question-is-not-exist-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import type { Question } from '@/domain/enterprise/entities/questions';
import type { QuestionRepository } from '@/domain/aplication/repositories/question-repository';

interface DeleteQuestionUseCaseRequest {
  id: string; //id from question
  authorId: string;
}
type DeleteQuestionUseCaseResponse = Either<
  QuestionAreNotExitsError | NotAllowedError,
  { question: Question }
>;
export class DeleteQuestionUseCase {
  constructor(public questionRepository: QuestionRepository) {}
  async execute({
    id,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      return left(new QuestionAreNotExitsError());
    }
    if (question.authorId !== authorId) {
      return left(new NotAllowedError());
    }
    this.questionRepository.delete(id);
    return right({ question });
  }
}
