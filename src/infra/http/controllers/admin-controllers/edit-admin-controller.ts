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
import { AuthGuard } from '@nestjs/passport';
import { TokenPayloadSchema } from '@/infra/auth/jwt-strategy';
import { WrongcredentialError } from '@/core/errors/wrong-credentials-error';
import { EditAdminUseCase } from '@/domain/aplication/use-cases/admin/edit-admin-use-case';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

const editAdminBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type EditAdminBodySchema = z.infer<typeof editAdminBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editAdminBodySchema);

@Controller('/edit/admin')
@UseGuards(AuthGuard('jwt'))
export class EditAdminController {
  constructor(public editAdminUseCase: EditAdminUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: EditAdminBodySchema,
    @CurrentUser() admin: TokenPayloadSchema,
  ) {
    const { sub } = admin;

    const { name, email, password } = body;

    if (!admin) {
      throw new UnauthorizedException('Unauthorized');
    }

    const result = await this.editAdminUseCase.execute({
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
