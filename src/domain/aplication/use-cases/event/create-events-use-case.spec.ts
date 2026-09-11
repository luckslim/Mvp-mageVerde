import { CreateEventUseCase } from './create-events-use-case';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { makeEvent } from 'test/factory/make-events-factory';
import { InMemoryUploadRepository } from 'test/repository/in-memory-upload-repository';
import { randomUUID } from 'node:crypto';
import { EventStatus } from '@/domain/enterprise/entities/events';

let inMemoryEventRepository: InMemoryEventRepository;
let inMemoryUploadRepository: InMemoryUploadRepository;
let sut: CreateEventUseCase;
describe('Create event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    inMemoryUploadRepository = new InMemoryUploadRepository();
    sut = new CreateEventUseCase(
      inMemoryEventRepository,
      inMemoryUploadRepository,
    );
  });
  it('should be able create event only with authorId(Admin)', async () => {
    const event = makeEvent({
      title: 'Trilha véu da noiva',
      content: `Que tal deixar a rotina de lado e aproveitar um dia em meio à natureza?
      Venha conosco para uma incrível trilha até a Cachoeira Véu da Noiva.
      Será uma oportunidade de viver momentos de aventura, diversão e tranquilidade.
      Durante o percurso, poderemos apreciar belas paisagens e respirar ar puro.
      Ao final da caminhada, teremos a recompensa de um refrescante banho de cachoeira.
      Não se esqueça de levar água, protetor solar, tênis confortável e muita disposição.
      Convide seus amigos e venha participar dessa experiência especial.
      Será um momento para relaxar, se divertir e criar boas lembranças.
      Esperamos você para essa aventura!`,
      time: '11:00h',
      colaborators: 'Prefeitura de Magé',
    });
    const bufferString = Buffer.from(randomUUID(), `utf-8`);

    const result = await sut.execute({
      Id: event.authorId,
      title: event.title,
      content: event.content,
      time: event.time,
      colaborators: event.colaborators,
      body: bufferString,
      mimeType: '.jpg',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.event.status).toBe(EventStatus.PENDING);
    }
  });

  it('should create an event as approved when the author is an admin', async () => {
    const event = makeEvent();
    const result = await sut.execute({
      Id: event.authorId,
      title: event.title,
      content: event.content,
      time: event.time,
      colaborators: event.colaborators,
      body: Buffer.from(randomUUID(), 'utf-8'),
      mimeType: 'image/jpeg',
      role: 'admin',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.event.status).toBe(EventStatus.APPROVED);
    }
  });
});
