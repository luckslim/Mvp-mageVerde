import { GetEventUseCase } from '@/domain/aplication/use-cases/event/get-event-use-case';
import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('get/events')
export class GetEventController {
  constructor(public GetEventUseCase: GetEventUseCase) {}
  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.GetEventUseCase.execute();
    return result.value;
  }
}
