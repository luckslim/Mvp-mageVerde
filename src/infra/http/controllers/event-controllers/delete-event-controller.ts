import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
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
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

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
    @CurrentUser() user: TokenPayloadSchema,
  ) {
    if (!user) {
      throw new UnauthorizedException();
    }
    const { sub, role } = user;
    const { eventId } = body;
    const result = await this.deleteEventUseCase.execute({
      Id: sub,
      eventId,
      role,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
