import type { Admin } from '@/domain/enterprise/entities/admin';

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>;
  abstract findByEmail(email: string): Promise<Admin | null>;
  abstract findById(id: string): Promise<Admin | null>;
  abstract save(admin: Admin): Promise<Admin | null>;
  abstract delete(id: string): Promise<void>;
}
