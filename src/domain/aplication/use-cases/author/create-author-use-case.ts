import { right, type Either } from '@/core/either';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { Inject, Injectable } from '@nestjs/common';
import { Author } from '@/domain/enterprise/entities/author';
import { AuthorRepository } from '../../repositories/author-repository';

interface CreateAuthorUseCaseRequest {
  typeUser: string;
  authorId: string;
  eventId?: string[];
  questionId?: string[];
  answerId?: string[];
}
type CreateAuthorUseCaseResponse = Either<
  userAlreadyExistError,
  { author: Author }
>;
@Injectable()
export class CreateAuthorUseCase {
  constructor(
    @Inject(AuthorRepository) public authorRepository: AuthorRepository,
  ) {}
  async execute({
    typeUser,
    authorId,
    eventId,
    questionId,
    answerId,
  }: CreateAuthorUseCaseRequest): Promise<CreateAuthorUseCaseResponse> {
    const author = Author.create({
      typeUser,
      authorId,
      eventId,
      questionId,
      answerId,
    });
    this.authorRepository.create(author);
    return right({ author });
  }
}
