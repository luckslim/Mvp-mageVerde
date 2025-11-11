import { makeUsers } from '../../../../../test/factory/make-users-factory';
import { InMemoryUserRepository } from '../../../../../test/repository/in-memory-user-repository';
import { EditUserUseCase } from './edit-user-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';

let inMemoryUserRepository: InMemoryUserRepository;
let sut: EditUserUseCase;
describe('edit users', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new EditUserUseCase(inMemoryUserRepository);
  });
  it('should be able edit users', async () => {
    for (let i = 0; i < 10; i++) {
      const user = makeUsers();
      inMemoryUserRepository.items.push(user);
    }
    const userSelected = makeUsers();
    inMemoryUserRepository.items.push(userSelected);
    const newUser = makeUsers({
      name: 'john Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });
    const result = await sut.execute({
      id: userSelected.id.toString(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      user: {
        props: {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
      },
    });
  });
  it('should not be able edit users with any id', async () => {
    for (let i = 0; i < 10; i++) {
      const user = makeUsers();
      inMemoryUserRepository.items.push(user);
    }
    const userSelected = makeUsers();
    inMemoryUserRepository.items.push(userSelected);
    const newUser = makeUsers({
      name: 'john Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });
    const result = await sut.execute({
      id: new UniqueEntityID().toString(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongcredentialError);
  });
});
