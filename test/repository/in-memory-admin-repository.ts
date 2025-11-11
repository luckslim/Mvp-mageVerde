import type { AdminRepository } from '@/domain/aplication/repositories/admin-repository';
import type { Admin } from '@/domain/enterprise/entities/admin';

export class InMemoryAdminRepository implements AdminRepository {
  public items: Admin[] = [];

  async delete(id: string) {
    const indexItem = this.items.findIndex((item) => item.id.toString() === id);
    this.items.splice(indexItem, 1);
  }
  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id);
    if (!admin) {
      return null;
    }
    return admin;
  }
  async findByEmail(email: string) {
    const admin = this.items.find((item) => item.email.toString() == email);
    if (!admin) {
      return null;
    }
    return admin;
  }
  async create(admin: Admin): Promise<void> {
    this.items.push(admin);
  }
  async save(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id);
    this.items[itemIndex] = admin;
    return admin;
  }
}
