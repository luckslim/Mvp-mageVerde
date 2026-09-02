import { CreateEventUseCase } from './create-events-use-case';
import { InMemoryEventRepository } from 'test/repository/in-memory-events-repository';
import { makeEvent } from 'test/factory/make-events-factory';
import { InMemoryAuthorRepository } from 'test/repository/in-memory-author-repository';
import { makeAuthor } from 'test/factory/make-author-factory';

let inMemoryEventRepository: InMemoryEventRepository;
let inMemoryAuthorRepository: InMemoryAuthorRepository;
let sut: CreateEventUseCase;
describe('Create event', () => {
  beforeEach(() => {
    inMemoryEventRepository = new InMemoryEventRepository();
    inMemoryAuthorRepository = new InMemoryAuthorRepository();
    sut = new CreateEventUseCase(inMemoryEventRepository);
  });
  it('should be able create event only with authorId(Admin)', async () => {
    const author = makeAuthor();
    inMemoryAuthorRepository.items.push(author);

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

    const result = await sut.execute({
      Id: author.authorId,
      title: event.title,
      content: event.content,
      time: event.time,
      colaborators: event.colaborators,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      event: {
        authorId: author.authorId,
        title: event.title,
        content: event.content,
        time: event.time,
        colaborators: event.colaborators,
      },
    });
  });
});
