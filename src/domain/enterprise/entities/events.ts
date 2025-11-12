import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
export interface eventProps {
  authorId: string;
  title: string;
  content: string;
  time: string;
  colaborators: string;
  createdAt?: Date;
}
export class Event extends Entity<eventProps> {
  get authorId() {
    return this.props.authorId;
  }
  get title() {
    return this.props.title;
  }
  get content() {
    return this.props.content;
  }
  get time() {
    return this.props.time;
  }
  get colaborators() {
    return this.props.colaborators;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  set authorId(authorId: string) {
    this.props.authorId = authorId;
  }
  set title(title: string) {
    this.props.title = title;
  }
  set content(content: string) {
    this.props.content = content;
  }
  set time(time: string) {
    this.props.time = time;
  }
  set colaborators(colaborators: string) {
    this.props.colaborators = colaborators;
  }

  static create(props: eventProps, id?: UniqueEntityID) {
    const event = new Event(props, id);
    return event;
  }
}
