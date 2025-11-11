import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { makeUsers } from '../../../../../test/factory/make-users-factory';
import { InMemoryUserRepository } from '../../../../../test/repository/in-memory-user-repository';
import { CreateUserUseCase } from './create-user-use-case';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let sut: CreateUserUseCase;
describe('Create users', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateUserUseCase(inMemoryUserRepository, fakeHasher);
  });
  it('should be able create users', async () => {
    const user = makeUsers();
    inMemoryUserRepository.items.push(user);
    const result = await sut.execute({
      name: 'johnSnow',
      email: 'johnSnow@gmail.com',
      password: '123123',
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      user: {
        name: 'johnSnow',
        email: 'johnSnow@gmail.com',
        password: '123123-hashed',
      },
    });
  });
  it('should not be able create users already exist', async () => {
    const user = makeUsers();
    inMemoryUserRepository.items.push(user);
    const result = await sut.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(userAlreadyExistError);
  });
});
