import { left, right, type Either } from '@/core/either';
import { AnswerAreNotExitsError } from '@/core/errors/answer-is-not-exist-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import type { Answer } from '@/domain/enterprise/entities/answers';
import type { AnswerRepository } from '@/domain/aplication/repositories/answer-repository';

interface DeleteAnswerUseCaseRequest {
  id: string; //id from answer
  authorId: string;
}
type DeleteAnswerUseCaseResponse = Either<
  AnswerAreNotExitsError | NotAllowedError,
  { answer: Answer }
>;
export class DeleteAnswerUseCase {
  constructor(public answerRepository: AnswerRepository) {}
  async execute({
    id,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(id);
    if (!answer) {
      return left(new AnswerAreNotExitsError());
    }
    if (answer.authorId !== authorId) {
      return left(new NotAllowedError());
    }
    this.answerRepository.delete(id);
    return right({ answer });
  }
}
