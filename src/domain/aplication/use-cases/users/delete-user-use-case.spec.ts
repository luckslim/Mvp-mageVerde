import { makeUsers } from '../../../../../test/factory/make-users-factory';
import { InMemoryUserRepository } from '../../../../../test/repository/in-memory-user-repository';
import { DeleteUserUseCase } from './delete-user-use-case';

let inMemoryUserRepository: InMemoryUserRepository;
let sut: DeleteUserUseCase;
describe('delete users', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteUserUseCase(inMemoryUserRepository);
  });
  it('should be able delete user', async () => {
    for (let i = 0; i < 10; i++) {
      const user = makeUsers();
      inMemoryUserRepository.items.push(user);
    }
    const userSelected = makeUsers();
    inMemoryUserRepository.items.push(userSelected);
    const result = await sut.execute({
      id: userSelected.id.toString(),
      email: userSelected.email,
    });
    expect(result.isRight()).toBe(true);
  });
  it('should not be able delete user with any email', async () => {
    for (let i = 0; i < 10; i++) {
      const user = makeUsers();
      inMemoryUserRepository.items.push(user);
    }
    const userSelected = makeUsers();
    inMemoryUserRepository.items.push(userSelected);
    const result = await sut.execute({
      id: userSelected.id.toString(),
      email: 'anyEmail@gmail.com',
    });
    expect(result.isLeft()).toBe(true);
  });
});
