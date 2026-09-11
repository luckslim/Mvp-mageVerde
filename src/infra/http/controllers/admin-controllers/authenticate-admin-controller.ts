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
import { AuthenticateAdminUseCase } from '@/domain/aplication/use-cases/admin/authenticate-admin-use-case';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';

const authenticateAdminBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(authenticateAdminBodySchema);

@Controller('/authenticate/admin')
export class AuthenticateAdminController {
  constructor(public authenticateAdmin: AuthenticateAdminUseCase) {}
  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: AuthenticateAdminBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateAdmin.execute({
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
      role: 'admin',
    };
  }
}
