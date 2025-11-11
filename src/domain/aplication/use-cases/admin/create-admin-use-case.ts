import { left, right, type Either } from '@/core/either';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { Admin } from '@/domain/enterprise/entities/admin';
import type { AdminRepository } from '../../repositories/admin-repository';
import type { HashGenerator } from '../../cryptography/hash-generator';

interface CreateAdminUseCaseRequest {
  name: string;
  email: string;
  password: string;
}
type CreateAdminUseCaseResponse = Either<
  userAlreadyExistError,
  { admin: Admin }
>;
export class CreateAdminUseCase {
  constructor(
    public adminRepository: AdminRepository,
    public hashGenerator: HashGenerator,
  ) {}
  async execute({
    name,
    email,
    password,
  }: CreateAdminUseCaseRequest): Promise<CreateAdminUseCaseResponse> {
    const adminAlreadyExist = await this.adminRepository.findByEmail(email);
    if (adminAlreadyExist) {
      return left(new userAlreadyExistError());
    } else {
      const hashedPassword = await this.hashGenerator.hash(password);

      const admin = Admin.create({
        name,
        email,
        password: hashedPassword,
      });
      await this.adminRepository.create(admin);
      return right({ admin });
    }
  }
}
