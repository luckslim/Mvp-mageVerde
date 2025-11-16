import { Author } from '@/domain/enterprise/entities/author';

export abstract class AuthorRepository {
  abstract create(author: Author): Promise<void>;
  abstract findById(id: string): Promise<Author>;
}
