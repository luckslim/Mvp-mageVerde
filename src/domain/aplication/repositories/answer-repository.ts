import type { Answer } from '@/domain/enterprise/entities/answers';

export interface AnswerRepository {
  create(answer: Answer): Promise<void>;
  findById(id: string): Promise<Answer | null>;
  save(answer: Answer): Promise<Answer | null>;
  delete(id: string): Promise<void>;
}
