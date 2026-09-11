import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipes';
import { AuthenticateUserUseCase } from '@/domain/aplication/use-cases/users/authenticate-user-use-case';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';

const authenticateUserBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(authenticateUserBodySchema);

@Controller('/authenticate/user')
export class AuthenticateUserController {
  constructor(public authenticateUser: AuthenticateUserUseCase) {}
  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: AuthenticateUserBodySchema) {
    const { email, password } = body;
    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case WrongcredentialError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;
    return {
      access_Token: accessToken,
      role: 'user',
    };
  }
}
