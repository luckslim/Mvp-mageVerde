import type { AnswerRepository } from "@/domain/aplication/repositories/answer-repository";
import type { Answer } from "@/domain/enterprise/entities/answers";

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = [];
  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
  }
  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);
    if (!answer) {
      return null;
    }
    return answer;
  }
  async save(answer: Answer): Promise<Answer | null> {
    const itemIndex = this.items.findIndex((item)=> item.id === answer.id)
    this.items[itemIndex]=answer
    return answer
  }
  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item)=>item.id.toString() !== id)
    this.items.splice(itemIndex, 1)
  }
}
