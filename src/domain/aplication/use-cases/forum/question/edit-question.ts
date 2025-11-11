import { left, right, type Either } from '@/core/either';
import { QuestionAreNotExitsError } from '@/core/errors/question-is-not-exist-error';
import type { Question } from '@/domain/enterprise/entities/questions';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import type { QuestionRepository } from '@/domain/aplication/repositories/question-repository';

interface EditQuestionUseCaseRequest {
  id: string;
  authorId: string;
  content: string;
}
type EditQuestionUseCaseResponse = Either<
  QuestionAreNotExitsError,
  { question: Question }
>;
export class EditQuestionUseCase {
  constructor(public questionRepository: QuestionRepository) {}
  async execute({
    id,
    authorId,
    content,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      return left(new QuestionAreNotExitsError());
    }
    if (question.authorId !== authorId) {
      return left(new NotAllowedError());
    } else {
      question.content = content;
      this.questionRepository.save(question);
      return right({ question });
    }
  }
}
