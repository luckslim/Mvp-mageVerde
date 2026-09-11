import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipes';
import { CreateEventUseCase } from '@/domain/aplication/use-cases/event/create-events-use-case';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { TokenPayloadSchema } from '@/infra/auth/jwt-strategy';
import { AuthGuard } from '@nestjs/passport';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { TitleAlreadyExistError } from '@/core/errors/title-already-exist-error';
import { FileInterceptor } from '@nestjs/platform-express';

const createEventBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  time: z.string(),
  date: z.coerce.date().optional(),
  location: z.string().optional(),
  colaborators: z.string(),
});

type CreateEventBodySchema = z.infer<typeof createEventBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createEventBodySchema);

@Controller('/create/event')
@UseGuards(AuthGuard('jwt'))
export class CreateEventController {
  constructor(public createEventUseCase: CreateEventUseCase) {}
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @Body(bodyValidationPipe) bodyRequest: CreateEventBodySchema,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: TokenPayloadSchema,
  ) {
    if (!user) {
      throw new UnauthorizedException(NotAllowedError);
    }

    const { sub, role } = user;

    const { title, content, colaborators, time, date, location } = bodyRequest;

    const result = await this.createEventUseCase.execute({
      Id: sub,
      title,
      content,
      colaborators,
      time,
      date,
      location,
      body: file.buffer,
      mimeType: file.mimetype,
      role,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case TitleAlreadyExistError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        case ResourceNotFoundError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
