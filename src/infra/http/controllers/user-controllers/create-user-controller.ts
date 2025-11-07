import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipes';

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema);

@Controller('/create/user')
export class CreateUserController {
  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateUserBodySchema) {}
}
