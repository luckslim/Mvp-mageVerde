import { left, right, type Either } from '@/core/either';
import { User } from '@/domain/enterprise/entities/user';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { HashGenerator } from '../../cryptography/hash-generator';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user-repository';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}
type CreateUserUseCaseResponse = Either<userAlreadyExistError, { user: User }>;
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository) private userRepository: UserRepository,
    @Inject(HashGenerator) public hashGenerator: HashGenerator,
  ) {}
  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userAlreadyExist = await this.userRepository.findByEmail(email);
    if (userAlreadyExist) {
      return left(new userAlreadyExistError());
    } else {
      const hashedPassword = await this.hashGenerator.hash(password);
      const user = User.create({
        name,
        email,
        password: hashedPassword,
      });
      await this.userRepository.create(user);
      return right({ user });
    }
  }
}
