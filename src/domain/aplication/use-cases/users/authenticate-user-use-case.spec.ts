import { makeUsers } from '../../../../../test/factory/make-users-factory';
import { InMemoryUserRepository } from '../../../../../test/repository/in-memory-user-repository';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { AuthenticateUserUseCase } from './authenticate-user-use-case';

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;
describe('Create users', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      encrypter,
      fakeHasher,
    );
  });
  it('should be able authenticate users', async () => {
    const user = makeUsers({
      password: await fakeHasher.hash('123123'),
    });
    inMemoryUserRepository.items.push(user);
    const result = await sut.execute({
      email: user.email,
      password: '123123',
    });
    expect(result.isRight()).toBe(true);
  });
  it('should not be able authenticate another users', async () => {
    const user = makeUsers({
      password: await fakeHasher.hash('123123'),
    });
    inMemoryUserRepository.items.push(user);
    const result = await sut.execute({
      email: user.email,
      password: 'invalidPassword',
    });
    expect(result.isLeft()).toBe(true);
  });

  it('should not be able authenticate a user that does not exist', async () => {
    const result = await sut.execute({
      email: 'missing-user@email.com',
      password: '123123',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongcredentialError);
  });

  it('should authenticate a user regardless of email casing', async () => {
    const user = makeUsers({
      email: 'john.doe@email.com',
      password: await fakeHasher.hash('123123'),
    });
    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      email: '  JOHN.DOE@EMAIL.COM  ',
      password: '123123',
    });

    expect(result.isRight()).toBe(true);
  });
});
