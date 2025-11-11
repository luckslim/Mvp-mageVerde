import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
export interface adminProps {
  name: string;
  email: string;
  password: string;
}
export class Admin extends Entity<adminProps> {
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }
  set email(email: string) {
    this.props.email = email;
  }
  set password(password: string) {
    this.props.password = password;
  }
  set name(name: string) {
    this.props.name = name;
  }
  static create(props: adminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id);
    return admin;
  }
}
