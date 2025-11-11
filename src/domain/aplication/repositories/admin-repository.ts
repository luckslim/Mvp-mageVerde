import type { Admin } from '@/domain/enterprise/entities/admin';

export interface AdminRepository {
  create(admin: Admin): Promise<void>;
  findByEmail(email: string): Promise<Admin | null>;
  findById(id: string): Promise<Admin | null>;
  save(admin: Admin): Promise<Admin | null>;
  delete(id: string): Promise<void>;
}
