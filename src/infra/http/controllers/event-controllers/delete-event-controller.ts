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
import { DeleteEventUseCase } from '@/domain/aplication/use-cases/event/delete-events-use-case';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/infra/auth/jwt-strategy';
import { AuthGuard } from '@nestjs/passport';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';

const deleteEventBodySchema = z.object({
  eventId: z.string(),
});

type DeleteEventBodySchema = z.infer<typeof deleteEventBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(deleteEventBodySchema);

@Controller('/delete/event')
@UseGuards(AuthGuard('jwt'))
export class DeleteEventController {
  constructor(public deleteEventUseCase: DeleteEventUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: DeleteEventBodySchema,
    @CurrentUser() admin: TokenPayloadSchema,
  ) {
    const { sub } = admin;
    if (!admin) {
      return new UnauthorizedException();
    }
    const { eventId } = body;
    const result = await this.deleteEventUseCase.execute({
      Id: sub,
      eventId,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case WrongcredentialError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
