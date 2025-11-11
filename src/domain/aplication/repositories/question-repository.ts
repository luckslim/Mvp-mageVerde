import type { Question } from '@/domain/enterprise/entities/questions';

export interface QuestionRepository {
  create(question: Question): Promise<void>;
  findById(id: string): Promise<Question | null>;
  save(question: Question): Promise<Question | null>;
  delete(id: string): Promise<void>;
}
