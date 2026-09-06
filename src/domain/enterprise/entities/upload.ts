import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
export interface uploadProps {
  userId: string;
  fileName: string;
  body: Buffer;
}
export class Upload extends Entity<uploadProps> {
  get userId() {
    return this.props.userId;
  }
  get fileName() {
    return this.props.fileName;
  }
  get body() {
    return this.props.body;
  }
  static create(props: uploadProps, id?: UniqueEntityID) {
    const upload = new Upload(props, id);
    return upload;
  }
}
