import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipes';
import { CreateEventUseCase } from '@/domain/aplication/use-cases/event/create-events-use-case';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/infra/auth/jwt-strategy';
import { EventAreNotExitsError } from '@/core/errors/event-are-not-exist-error';
import { AuthGuard } from '@nestjs/passport';

const createEventBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  time: z.string(),
  colaborators: z.string(),
});

type CreateEventBodySchema = z.infer<typeof createEventBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createEventBodySchema);

@Controller('/create/event')
@UseGuards(AuthGuard('jwt'))
export class CreateEventController {
  constructor(public createEventUseCase: CreateEventUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateEventBodySchema,
    @CurrentUser() admin: TokenPayloadSchema,
  ) {
    const { sub } = admin;
    if (!admin) {
      return new UnauthorizedException();
    }
    const { title, content, colaborators, time } = body;
    const result = await this.createEventUseCase.execute({
      authorId: sub,
      colaborators,
      content,
      time,
      title,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case EventAreNotExitsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
