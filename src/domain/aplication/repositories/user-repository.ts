import type { User } from '@/domain/enterprise/entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract save(user: User): Promise<User | null>;
  abstract delete(id: string): Promise<void>;
}
