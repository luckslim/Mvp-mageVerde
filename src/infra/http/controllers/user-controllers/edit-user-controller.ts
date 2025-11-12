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
import { EditUserUseCase } from '@/domain/aplication/use-cases/users/edit-user-use-case';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/infra/auth/jwt-strategy';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';

const editUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type EditUserBodySchema = z.infer<typeof editUserBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema);

@Controller('/edit/user')
@UseGuards(AuthGuard('jwt'))
export class EditUserController {
  constructor(public editUserUseCase: EditUserUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: EditUserBodySchema,
    @CurrentUser() user: TokenPayloadSchema,
  ) {
    const { sub } = user;

    const { name, email, password } = body;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const result = await this.editUserUseCase.execute({
      id: sub,
      name,
      email,
      password,
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
