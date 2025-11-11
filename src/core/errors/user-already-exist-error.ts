import type { UseCaseError } from '@/core/errors/use-case-error';

export class userAlreadyExistError extends Error implements UseCaseError {
  constructor() {
    super('user already exist');
  }
}
