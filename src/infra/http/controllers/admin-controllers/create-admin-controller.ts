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
import { CreateAdminUseCase } from '@/domain/aplication/use-cases/admin/create-admin-use-case';
import { userAlreadyExistError } from '@/core/errors/user-already-exist-error';

const createAdminBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateAdminBodySchema = z.infer<typeof createAdminBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createAdminBodySchema);

@Controller('/create/admin')
export class CreateAdminController {
  constructor(public createAdminUseCase: CreateAdminUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateAdminBodySchema) {
    const { name, email, password } = body;

    const result = await this.createAdminUseCase.execute({
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
