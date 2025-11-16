import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Author } from '@/domain/enterprise/entities/author';
import type { AuthorType, Author as PrismaAuthor } from '@prisma/client';

export class PrismaAuthorMapper {
  static toDomain(raw: PrismaAuthor): Author {
    return Author.create(
      {
        typeUser: raw.type,
        authorId: raw.userId,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(author: Author): PrismaAuthor {
    return {
      id: author.id.toString(),
      type: author.typeUser as AuthorType,
      userId: author.authorId,
    };
  }
}
