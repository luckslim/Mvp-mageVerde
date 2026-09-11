import { GetEventUseCase } from '@/domain/aplication/use-cases/event/get-event-use-case';
import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('get/events')
@UseGuards(AuthGuard('jwt'))
export class GetEventController {
  constructor(public GetEventUseCase: GetEventUseCase) {}
  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.GetEventUseCase.execute();
    return result.value;
  }
}
