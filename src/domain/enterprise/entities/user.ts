import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
export interface userProps {
  name: string;
  email: string;
  password: string;
}
export class User extends Entity<userProps> {
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
  static create(props: userProps, id?: UniqueEntityID) {
    const user = new User(props, id);
    return user;
  }
}
