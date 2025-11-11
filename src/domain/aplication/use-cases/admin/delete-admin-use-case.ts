import { left, right, type Either } from '@/core/either';
import { Admin } from '@/domain/enterprise/entities/admin';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import type { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import type { AdminRepository } from '../../repositories/admin-repository';

interface DeleteAdminUseCaseRequest {
  id: string;
  email: string;
}
type DeleteAdminUseCaseResponse = Either<
  userAlreadyExistError,
  { admin: Admin }
>;
export class DeleteAdminUseCase {
  constructor(public adminRepository: AdminRepository) {}
  async execute({
    id,
    email,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      return left(new WrongcredentialError());
    }
    if (admin.email !== email) {
      return left(new WrongcredentialError());
    }
    this.adminRepository.delete(id);
    return right({ admin });
  }
}
