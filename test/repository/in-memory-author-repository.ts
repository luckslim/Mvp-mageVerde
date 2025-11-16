import type { AuthorRepository } from '@/domain/aplication/repositories/author-repository';
import { Author } from '@/domain/enterprise/entities/author';

export class InMemoryAuthorRepository implements AuthorRepository {
  public items: Author[] = [];
  async create(author: Author): Promise<void> {
    this.items.push(author);
  }
  async findById(id: string): Promise<Author> {
    const author = this.items.find((item) => item.authorId === id);
    if (!author) {
      return null;
    }
    return author;
  }
  async save(author: Author): Promise<Author | null> {
    const itemIndex = this.items.findIndex((item) => item.id === author.id);
    this.items[itemIndex] = author;
    return author;
  }
}
