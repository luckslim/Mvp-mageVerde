import { left, right, type Either } from '@/core/either';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import type { AdminRepository } from '../../repositories/admin-repository';
import type { Encrypter } from '../../cryptography/encrypter';
import type { HashComparer } from '../../cryptography/hash-comparer';

interface AuthenticateAdminUseCaseRequest {
  email: string;
  password: string;
}
type AuthenticateAdminUseCaseResponse = Either<
  userAlreadyExistError | WrongcredentialError,
  { accessToken: string }
>;
export class AuthenticateAdminUseCase {
  constructor(
    public adminRepository: AdminRepository,
    public encrypter: Encrypter,
    public hashComparer: HashComparer,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      return left(new userAlreadyExistError());
    }
    const isPasswordValid = await this.hashComparer.compare(
      password,
      admin.password,
    );
    if (!isPasswordValid) {
      return left(new WrongcredentialError());
    } else {
      const accessToken = await this.encrypter.encrypt({
        sub: admin.id.toString(),
      });
      return right({ accessToken });
    }
  }
}
