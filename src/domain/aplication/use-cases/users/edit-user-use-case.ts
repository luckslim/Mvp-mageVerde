import { left, right, type Either } from '@/core/either';
import { User } from '@/domain/enterprise/entities/user';
import { UserRepository } from '../../repositories/user-repository';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { Inject, Injectable } from '@nestjs/common';
import { HashGenerator } from '../../cryptography/hash-generator';

interface EditUserUseCaseRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}
type EditUserUseCaseResponse = Either<WrongcredentialError, { user: User }>;
@Injectable()
export class EditUserUseCase {
  constructor(
    @Inject(UserRepository) public userRepository: UserRepository,
    @Inject(HashGenerator) public hashGenerator: HashGenerator,
  ) {}

  async execute({
    id,
    name,
    email,
    password,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.userRepository.findById(id);
    const passwordHashed = await this.hashGenerator.hash(password);
    if (!user) {
      return left(new WrongcredentialError());
    } else {
      user.name = name;
      user.email = email;
      user.password = passwordHashed;
      this.userRepository.save(user);
      return right({ user });
    }
  }
}
