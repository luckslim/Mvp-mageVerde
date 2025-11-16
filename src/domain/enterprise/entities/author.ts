import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
export interface authorProps {
  typeUser: string;
  authorId: string;
  eventId?: string[];
  questionId?: string[];
  answerId?: string[];
}
export class Author extends Entity<authorProps> {
  get typeUser() {
    return this.props.typeUser;
  }
  get authorId() {
    return this.props.authorId;
  }
  get eventId() {
    return this.props.eventId;
  }
  get questionId() {
    return this.props.questionId;
  }
  get answerId() {
    return this.props.answerId;
  }
  static create(props: authorProps, id?: UniqueEntityID) {
    const author = new Author(props, id);
    return author;
  }
}
