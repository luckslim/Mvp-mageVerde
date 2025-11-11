import { left, right, type Either } from '@/core/either';
import { Admin } from '@/domain/enterprise/entities/admin';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import type { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import type { AdminRepository } from '../../repositories/admin-repository';

interface EditAdminUseCaseRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}
type EditAdminUseCaseResponse = Either<userAlreadyExistError, { admin: Admin }>;
export class EditAdminUseCase {
  constructor(public adminRepository: AdminRepository) {}
  async execute({
    id,
    name,
    email,
    password,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      return left(new WrongcredentialError());
    } else {
      admin.name = name;
      admin.email = email;
      admin.password = password;
      this.adminRepository.save(admin);
      return right({ admin });
    }
  }
}
