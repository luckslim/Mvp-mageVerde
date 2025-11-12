import { left, right, type Either } from '@/core/either';
import { User } from '@/domain/enterprise/entities/user';
import { UserRepository } from '../../repositories/user-repository';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { Inject, Injectable } from '@nestjs/common';

interface DeleteUserUseCaseRequest {
  id: string;
  email: string;
}
type DeleteUserUseCaseResponse = Either<WrongcredentialError, { user: User }>;
@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject(UserRepository) public userRepository: UserRepository) {}
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
