import { left, right, type Either } from '@/core/either';
import { User } from '@/domain/enterprise/entities/user';
import type { UserRepository } from '../../repositories/user-repository';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';

interface EditUserUseCaseRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}
type EditUserUseCaseResponse = Either<userAlreadyExistError, { user: User }>;
export class EditUserUseCase {
  constructor(public userRepository: UserRepository) {}
  async execute({
    id,
    name,
    email,
    password,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return left(new WrongcredentialError());
    } else {
      user.name = name;
      user.email = email;
      user.password = password;
      this.userRepository.save(user);
      return right({ user });
    }
  }
}
