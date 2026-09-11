import { GetEventUseCase } from '@/domain/aplication/use-cases/event/get-event-use-case';
import { GetMyEventsUseCase } from '@/domain/aplication/use-cases/event/get-my-events-use-case';
import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/infra/auth/jwt-strategy';

@Controller('get/events')
@UseGuards(AuthGuard('jwt'))
export class GetEventController {
  constructor(
    public GetEventUseCase: GetEventUseCase,
    public getMyEventsUseCase: GetMyEventsUseCase,
  ) {}
  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.GetEventUseCase.execute();
    return result.value;
  }

  @Get('mine')
  @HttpCode(200)
  async mine(@CurrentUser() user: TokenPayloadSchema) {
    return { event: await this.getMyEventsUseCase.execute(user.sub) };
  }
}
