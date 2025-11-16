import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Author, type authorProps } from '@/domain/enterprise/entities/author';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAuthorMapper } from '@/infra/database/prisma/mappers/prisma-author-mapper';

export function makeAuthor(
  override: Partial<authorProps> = {},
  id?: UniqueEntityID,
) {
  const author = Author.create(
    {
      typeUser: 'ADMIN',
      authorId: faker.string.uuid(),
      eventId: [faker.string.uuid(), faker.string.uuid()],
      questionId: [faker.string.uuid(), faker.string.uuid()],
      answerId: [faker.string.uuid(), faker.string.uuid()],
      ...override,
    },
    id,
  );
  return author;
}
@Injectable()
export class AuthorFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaAuthor(data: Partial<authorProps>): Promise<Author> {
    const author = makeAuthor(data);
    await this.prisma.author.create({
      data: PrismaAuthorMapper.toPrisma(author),
    });
    return author;
  }
}
