import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface eventProps {
  authorId: string;
  title: string;
  content: string;
  time: string;
  colaborators: string;
  fileUrl: string;
  date?: Date | null;
  location?: string | null;
  status?: EventStatus;
  createdAt?: Date;
}
export class Event extends Entity<eventProps> {
  get authorId() {
    return this.props.authorId;
  }
  get title() {
    return this.props.title;
  }
  get fileUrl() {
    return this.props.fileUrl;
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
  get date() {
    return this.props.date ?? null;
  }
  get location() {
    return this.props.location ?? null;
  }
  get status() {
    return this.props.status ?? EventStatus.PENDING;
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
  set fileUrl(fileUrl: string) {
    this.props.fileUrl = fileUrl;
  }
  set colaborators(colaborators: string) {
    this.props.colaborators = colaborators;
  }
  set date(date: Date | null) {
    this.props.date = date;
  }
  set location(location: string | null) {
    this.props.location = location;
  }
  set status(status: EventStatus) {
    this.props.status = status;
  }

  static create(props: eventProps, id?: UniqueEntityID) {
    const event = new Event(props, id);
    return event;
  }
}
