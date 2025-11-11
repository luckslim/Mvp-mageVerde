import type { QuestionRepository } from "@/domain/aplication/repositories/question-repository";
import type { Question } from "@/domain/enterprise/entities/questions";

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = [];
  async create(question: Question): Promise<void> {
    this.items.push(question);
  }
  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);
    if (!question) {
      return null;
    }
    return question;
  }
  async save(question: Question): Promise<Question | null> {
    const itemIndex = this.items.findIndex((item)=> item.id === question.id)
    this.items[itemIndex]=question
    return question
  }
  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item)=>item.id.toString() !== id)
    this.items.splice(itemIndex, 1)
  }
}
