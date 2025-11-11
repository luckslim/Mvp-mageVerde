import { makeAdmins } from '../../../../../test/factory/make-admin-factory';
import { InMemoryAdminRepository } from '../../../../../test/repository/in-memory-admin-repository';
import { DeleteAdminUseCase } from './delete-admin-use-case';

let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: DeleteAdminUseCase;
describe('delete events', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new DeleteAdminUseCase(inMemoryAdminRepository);
  });
  it('should be able delete admin', async () => {
    for (let i = 0; i < 10; i++) {
      const admin = makeAdmins();
      inMemoryAdminRepository.items.push(admin);
    }
    const adminSelected = makeAdmins();
    inMemoryAdminRepository.items.push(adminSelected);
    const result = await sut.execute({
      id: adminSelected.id.toString(),
      email: adminSelected.email,
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryAdminRepository.items).toHaveLength(10);
  });
  it('should not be able delete admin with any email', async () => {
    for (let i = 0; i < 10; i++) {
      const admin = makeAdmins();
      inMemoryAdminRepository.items.push(admin);
    }
    const adminSelected = makeAdmins();
    inMemoryAdminRepository.items.push(adminSelected);
    const result = await sut.execute({
      id: adminSelected.id.toString(),
      email: 'anyEmail@gmail.com',
    });
    expect(result.isLeft()).toBe(true);
  });
});
