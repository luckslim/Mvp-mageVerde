import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipes';
import { AuthenticateUserUseCase } from '@/domain/aplication/use-cases/users/authenticate-user-use-case';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';

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
    console.log(body);
    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    console.log(result)
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case userAlreadyExistError:
          throw new ConflictException(error.message);
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
