import { left, right, type Either } from '@/core/either';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { AdminRepository } from '../../repositories/admin-repository';
import { Encrypter } from '../../cryptography/encrypter';
import { HashComparer } from '../../cryptography/hash-comparer';
import { Inject, Injectable } from '@nestjs/common';
import { normalizeEmail } from '@/core/utils/normalize-email';

interface AuthenticateAdminUseCaseRequest {
  email: string;
  password: string;
}
type AuthenticateAdminUseCaseResponse = Either<
  WrongcredentialError,
  { accessToken: string }
>;
@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    @Inject(AdminRepository) public adminRepository: AdminRepository,
    @Inject(Encrypter) public encrypter: Encrypter,
    @Inject(HashComparer) public hashComparer: HashComparer,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByEmail(normalizeEmail(email));
    if (!admin) {
      return left(new WrongcredentialError());
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
        role: 'admin',
      });
      return right({ accessToken });
    }
  }
}
