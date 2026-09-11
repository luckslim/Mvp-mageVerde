import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import z from 'zod';
import { AdminGuard } from '@/infra/auth/admin.guard';
import { EventStatus } from '@/domain/enterprise/entities/events';
import { GetAllEventsUseCase } from '@/domain/aplication/use-cases/event/get-all-events-use-case';
import { ModerateEventUseCase } from '@/domain/aplication/use-cases/event/moderate-event-use-case';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipes';

const moderateEventBodySchema = z.object({
  status: z.enum([EventStatus.APPROVED, EventStatus.REJECTED]),
});

type ModerateEventBody = z.infer<typeof moderateEventBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(moderateEventBodySchema);

@Controller('/admin/events')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminEventController {
  constructor(
    public getAllEvents: GetAllEventsUseCase,
    public moderateEvent: ModerateEventUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async index() {
    return { events: await this.getAllEvents.execute() };
  }

  @Patch(':eventId/status')
  @HttpCode(200)
  async updateStatus(
    @Param('eventId') eventId: string,
    @Body(bodyValidationPipe) body: ModerateEventBody,
  ) {
    const result = await this.moderateEvent.execute({
      eventId,
      status: body.status,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return result.value;
  }
}
