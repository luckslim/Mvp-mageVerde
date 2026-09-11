import { left, right, type Either } from '@/core/either';
import { Admin } from '@/domain/enterprise/entities/admin';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { AdminRepository } from '../../repositories/admin-repository';
import { Inject, Injectable } from '@nestjs/common';
import { HashGenerator } from '../../cryptography/hash-generator';

interface EditAdminUseCaseRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}
type EditAdminUseCaseResponse = Either<WrongcredentialError, { admin: Admin }>;
@Injectable()
export class EditAdminUseCase {
  constructor(
    @Inject(AdminRepository) public adminRepository: AdminRepository,
    @Inject(HashGenerator) public hashGenerator: HashGenerator,
  ) {}
  async execute({
    id,
    name,
    email,
    password,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      return left(new WrongcredentialError());
    }

    const passwordHashed = await this.hashGenerator.hash(password);
    admin.name = name;
    admin.email = email;
    admin.password = passwordHashed;
    this.adminRepository.save(admin);
    return right({ admin });
  }
}
