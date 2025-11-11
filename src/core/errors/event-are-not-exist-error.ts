import type { UseCaseError } from '@/core/errors/use-case-error';

export class EventAreNotExitsError extends Error implements UseCaseError {
  constructor() {
    super(`the event is not exist`);
  }
}
