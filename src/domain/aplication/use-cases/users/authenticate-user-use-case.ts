import { left, right, type Either } from '@/core/either';
import { UserRepository } from '../../repositories/user-repository';
import { Encrypter } from '../../cryptography/encrypter';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { HashComparer } from '../../cryptography/hash-comparer';
import { Inject, Injectable } from '@nestjs/common';
import { normalizeEmail } from '@/core/utils/normalize-email';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}
type AuthenticateUserUseCaseResponse = Either<
  WrongcredentialError,
  { accessToken: string }
>;
@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(UserRepository) public userRepository: UserRepository,
    @Inject(Encrypter) public encrypter: Encrypter,
    @Inject(HashComparer) public hashComparer: HashComparer,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(normalizeEmail(email));
    if (!user) {
      return left(new WrongcredentialError());
    }
    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return left(new WrongcredentialError());
    } else {
      const accessToken = await this.encrypter.encrypt({
        sub: user.id.toString(),
        role: 'user',
      });
      return right({ accessToken });
    }
  }
}
