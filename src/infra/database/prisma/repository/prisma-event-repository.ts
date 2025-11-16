import { EventRepository } from '@/domain/aplication/repositories/event-repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { Event } from '@/domain/enterprise/entities/events';
import { PrismaEventMapper } from '../mappers/prisma-event-mapper';

@Injectable()
export class PrismaEventRepository implements EventRepository {
  constructor(private prisma: PrismaService) {}
  async create(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event);
    await this.prisma.event.create({
      data,
    });
  }
  async findByTitle(title: string): Promise<Event | null> {
    const event = await this.prisma.event.findFirst({
      where: {
        title,
      },
    });
    if (!event) {
      return null;
    }
    return PrismaEventMapper.toDomain(event);
  }
  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
      },
    });
    if (!event) {
      return null;
    }
    return PrismaEventMapper.toDomain(event);
  }
  async findByAll(): Promise<Event[] | null> {
    const events = await this.prisma.event.findMany();
    return events.map((event) => PrismaEventMapper.toDomain(event));
  }
  async save(event: Event): Promise<Event | null> {
    const data = PrismaEventMapper.toPrisma(event);
    const newEvent = await this.prisma.event.update({
      where: {
        id: event.id.toString(),
      },
      data,
    });
    return PrismaEventMapper.toDomain(newEvent);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: {
        id,
      },
    });
  }
}
