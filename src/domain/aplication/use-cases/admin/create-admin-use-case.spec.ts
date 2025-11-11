import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { makeAdmins } from '../../../../../test/factory/make-admin-factory';
import { InMemoryAdminRepository } from '../../../../../test/repository/in-memory-admin-repository';
import { CreateAdminUseCase } from './create-admin-use-case';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';

let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let sut: CreateAdminUseCase;
describe('Create admins', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateAdminUseCase(inMemoryAdminRepository, fakeHasher);
  });
  it('should be able create admins', async () => {
    const admin = makeAdmins();
    inMemoryAdminRepository.items.push(admin);
    const result = await sut.execute({
      name: 'johnSnow',
      email: 'johnSnow@gmail.com',
      password: '123123',
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      admin: {
        name: 'johnSnow',
        email: 'johnSnow@gmail.com',
        password: '123123-hashed',
      },
    });
  });
  it('should not be able create admins already exist', async () => {
    const admin = makeAdmins();
    inMemoryAdminRepository.items.push(admin);
    const result = await sut.execute({
      name: admin.name,
      email: admin.email,
      password: admin.password,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(userAlreadyExistError);
  });
});
