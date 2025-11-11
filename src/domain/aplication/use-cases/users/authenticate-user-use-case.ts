import { left, right, type Either } from '@/core/either';
import type { UserRepository } from '../../repositories/user-repository';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import type { Encrypter } from '../../cryptography/encrypter';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import type { HashComparer } from '../../cryptography/hash-comparer';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}
type AuthenticateUserUseCaseResponse = Either<
  userAlreadyExistError | WrongcredentialError,
  { accessToken: string }
>;
export class AuthenticateUserUseCase {
  constructor(
    public userRepository: UserRepository,
    public encrypter: Encrypter,
    public hashComparer: HashComparer,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return left(new userAlreadyExistError());
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
      });
      return right({ accessToken });
    }
  }
}
