import type { UseCaseError } from '@/core/errors/use-case-error';

export class QuestionAreNotExitsError extends Error implements UseCaseError {
  constructor() {
    super(`the Question is not exist`);
  }
}
