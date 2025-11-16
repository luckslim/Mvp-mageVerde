import { AuthorRepository } from '@/domain/aplication/repositories/author-repository';
import { Author } from '@/domain/enterprise/entities/author';
import { PrismaService } from '../prisma.service';
import { PrismaAuthorMapper } from '../mappers/prisma-author-mapper';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PrismaAuthorRepository implements AuthorRepository {
  constructor(private prisma: PrismaService) {}
  async create(author: Author): Promise<void> {
    const data = PrismaAuthorMapper.toPrisma(author);
    await this.prisma.author.create({
      data,
    });
  }
  async findById(id: string): Promise<Author> {
    const author = await this.prisma.author.findFirst({
      where: {
        userId: id,
      },
    });
    return PrismaAuthorMapper.toDomain(author);
  }
}
