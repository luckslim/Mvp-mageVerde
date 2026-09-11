import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { normalizeEmail } from '@/core/utils/normalize-email';
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
    this.props.email = normalizeEmail(email);
  }
  set password(password: string) {
    this.props.password = password;
  }
  set name(name: string) {
    this.props.name = name;
  }
  static create(props: userProps, id?: UniqueEntityID) {
    const user = new User({ ...props, email: normalizeEmail(props.email) }, id);
    return user;
  }
}
