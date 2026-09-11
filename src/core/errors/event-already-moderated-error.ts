import type { UseCaseError } from '@/core/errors/use-case-error';

export class EventAlreadyModeratedError extends Error implements UseCaseError {
  constructor() {
    super('This event has already been moderated');
  }
}
