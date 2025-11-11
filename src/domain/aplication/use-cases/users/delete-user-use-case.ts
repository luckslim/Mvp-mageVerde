import { left, right, type Either } from '@/core/either';
import { User } from '@/domain/enterprise/entities/user';
import type { UserRepository } from '../../repositories/user-repository';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';

interface DeleteUserUseCaseRequest {
  id: string;
  email: string;
}
type DeleteUserUseCaseResponse = Either<userAlreadyExistError, { user: User }>;
export class DeleteUserUseCase {
  constructor(public userRepository: UserRepository) {}
  async execute({
    id,
    email,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return left(new WrongcredentialError());
    }
    if (user.email !== email) {
      return left(new WrongcredentialError());
    }
    this.userRepository.delete(id);
    return right({ user });
  }
}
