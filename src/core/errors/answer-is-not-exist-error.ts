import type { UseCaseError } from '@/core/errors/use-case-error';

export class AnswerAreNotExitsError extends Error implements UseCaseError {
  constructor() {
    super(`the Answer is not exist`);
  }
}
