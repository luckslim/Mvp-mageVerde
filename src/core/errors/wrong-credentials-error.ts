import type { UseCaseError } from '@/core/errors/use-case-error';

export class WrongcredentialError extends Error implements UseCaseError {
  constructor() {
    super('credentials are not valid');
  }
}
