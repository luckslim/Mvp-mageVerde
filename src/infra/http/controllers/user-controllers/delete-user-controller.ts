import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipes';
import { DeleteUserUseCase } from '@/domain/aplication/use-cases/users/delete-user-use-case';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/infra/auth/jwt-strategy';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';

const deleteUserBodySchema = z.object({
  email: z.email(),
});

type DeleteUserBodySchema = z.infer<typeof deleteUserBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(deleteUserBodySchema);

@Controller('/delete/user')
@UseGuards(AuthGuard('jwt'))
export class DeleteUserController {
  constructor(public deleteUserUseCase: DeleteUserUseCase) {}
  @Post()
  @HttpCode(202)
  async handle(
    @Body(bodyValidationPipe) body: DeleteUserBodySchema,
    @CurrentUser() user: TokenPayloadSchema,
  ) {
    const { sub } = user;

    const { email } = body;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const result = await this.deleteUserUseCase.execute({
      id: sub,
      email,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case WrongcredentialError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
