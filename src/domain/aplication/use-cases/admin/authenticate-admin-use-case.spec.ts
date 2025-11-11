import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { makeAdmins } from '../../../../../test/factory/make-admin-factory';
import { InMemoryAdminRepository } from '../../../../../test/repository/in-memory-admin-repository';
import { AuthenticateAdminUseCase } from './authenticate-admin-use-case';

let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;
let sut: AuthenticateAdminUseCase;
describe('authenticate admins', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminRepository,
      encrypter,
      fakeHasher,
    );
  });
  it('should be able authenticate admins', async () => {
    const admin = makeAdmins({
      password: await fakeHasher.hash('123123'),
    });
    inMemoryAdminRepository.items.push(admin);
    const result = await sut.execute({
      email: admin.email,
      password: '123123',
    });
    expect(result.isRight()).toBe(true);
  });
  it('should not be able authenticate another admins', async () => {
    const admin = makeAdmins({
      password: await fakeHasher.hash('123123'),
    });
    inMemoryAdminRepository.items.push(admin);
    const result = await sut.execute({
      email: admin.email,
      password: 'invalidPassword',
    });
    expect(result.isLeft()).toBe(true);
  });
});
