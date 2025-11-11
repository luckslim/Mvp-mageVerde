import type { UserRepository } from "@/domain/aplication/repositories/user-repository";
import type { User } from "@/domain/enterprise/entities/user";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async delete(id: string) {
    const indexItem = this.items.findIndex((item) => item.id.toString() === id);
    this.items.splice(indexItem, 1);
  }
  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id);
    if (!user) {
      return null;
    }
    return user;
  }
  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email.toString() == email);
    if (!user) {
      return null;
    }
    return user;
  }
  async create(user: User): Promise<void> {
    this.items.push(user);
  }
  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);
    this.items[itemIndex] = user;
    return user;
  }
}
