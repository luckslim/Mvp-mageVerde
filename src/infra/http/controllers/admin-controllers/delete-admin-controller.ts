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
import { DeleteAdminUseCase } from '@/domain/aplication/use-cases/admin/delete-admin-use-case';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

const deleteAdminBodySchema = z.object({
  email: z.email(),
});

type DeleteAdminBodySchema = z.infer<typeof deleteAdminBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(deleteAdminBodySchema);

@Controller('/delete/admin')
@UseGuards(AuthGuard('jwt'))
export class DeleteAdminController {
  constructor(public deleteAdminUseCase: DeleteAdminUseCase) {}
  @Post()
  @HttpCode(202)
  async handle(
    @Body(bodyValidationPipe) body: DeleteAdminBodySchema,
    @CurrentUser() admin: TokenPayloadSchema,
  ) {
    const { sub } = admin;

    const { email } = body;

    if (!admin) {
      throw new UnauthorizedException('Unauthorized');
    }

    const result = await this.deleteAdminUseCase.execute({
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
