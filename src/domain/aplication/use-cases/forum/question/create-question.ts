import { left, right, type Either } from '@/core/either';
import { Question } from '@/domain/enterprise/entities/questions';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { EventAreNotExitsError } from '@/core/errors/event-are-not-exist-error';
import type { QuestionRepository } from '@/domain/aplication/repositories/question-repository';
import type { EventsRepository } from '@/domain/aplication/repositories/event-repository';

interface CreateQuestionUseCaseRequest {
  id: string; //id from event
  authorId: string;
  content: string;
}
type CreateQuestionUseCaseResponse = Either<
  userAlreadyExistError | EventAreNotExitsError,
  { question: Question }
>;
export class CreateQuestionUseCase {
  constructor(
    public questionRepository: QuestionRepository,
    public eventRepository: EventsRepository,
  ) {}
  async execute({
    id,
    authorId,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      return left(new EventAreNotExitsError());
    }
    const question = Question.create({
      authorId,
      content,
    });
    return right({ question });
  }
}
