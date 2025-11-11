import type { UseCaseError } from '@/core/errors/use-case-error';

export class TitleAlreadyExistError extends Error implements UseCaseError {
  constructor(public title: string) {
    super(`the title ${title} already exist`);
  }
}
