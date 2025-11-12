import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryAdminRepository } from '../../../../../test/repository/in-memory-admin-repository';
import { EditAdminUseCase } from './edit-admin-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { makeAdmins } from 'test/factory/make-admin-factory';

let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: EditAdminUseCase;
let fakeHasher: FakeHasher;
describe('edit admins', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    sut = new EditAdminUseCase(inMemoryAdminRepository, fakeHasher);
  });
  it('should be able edit admins', async () => {
    for (let i = 0; i < 10; i++) {
      const admin = makeAdmins();
      inMemoryAdminRepository.items.push(admin);
    }
    const adminSelected = makeAdmins();
    inMemoryAdminRepository.items.push(adminSelected);
    const newAdmin = makeAdmins({
      name: 'john Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });
    const result = await sut.execute({
      id: adminSelected.id.toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      password: `${newAdmin.password}`,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      admin: {
        props: {
          name: newAdmin.name,
          email: newAdmin.email,
          password: `${newAdmin.password}-hashed`,
        },
      },
    });
  });
  it('should not be able edit admins with any id', async () => {
    for (let i = 0; i < 10; i++) {
      const admin = makeAdmins();
      inMemoryAdminRepository.items.push(admin);
    }
    const adminSelected = makeAdmins();
    inMemoryAdminRepository.items.push(adminSelected);
    const newAdmin = makeAdmins({
      name: 'john Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });
    const result = await sut.execute({
      id: new UniqueEntityID().toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      password: newAdmin.password,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongcredentialError);
  });
});
