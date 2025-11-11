import { left, right, type Either } from '@/core/either';
import type { Answer } from '@/domain/enterprise/entities/answers';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import type { AnswerRepository } from '@/domain/aplication/repositories/answer-repository';
import { AnswerAreNotExitsError } from '@/core/errors/answer-is-not-exist-error';

interface EditAnswerUseCaseRequest {
  id: string; //id from answer
  authorId: string;
  content: string;
}
type EditAnswerUseCaseResponse = Either<
  AnswerAreNotExitsError,
  { answer: Answer }
>;
export class EditAnswerUseCase {
  constructor(public answerRepository: AnswerRepository) {}
  async execute({
    id,
    authorId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(id);
    if (!answer) {
      return left(new AnswerAreNotExitsError());
    }
    if (answer.authorId !== authorId) {
      return left(new NotAllowedError());
    } else {
      answer.content = content;
      this.answerRepository.save(answer);
      return right({ answer });
    }
  }
}
