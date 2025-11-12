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
import { CreateUserUseCase } from '@/domain/aplication/use-cases/users/create-user-use-case';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema);

@Controller('/create/user')
export class CreateUserController {
  constructor(public createUserUseCase: CreateUserUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    const { name, email, password } = body;

    const result = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case userAlreadyExistError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
