import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
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
import { EventAreNotExitsError } from '@/core/errors/event-are-not-exist-error';
import { AuthGuard } from '@nestjs/passport';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { FileInterceptor } from '@nestjs/platform-express';

const createEventBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  time: z.string(),
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
    @CurrentUser() admin: TokenPayloadSchema,
  ) {
    const { sub } = admin;

    if (!admin) {
      return new UnauthorizedException(NotAllowedError);
    }

    const { title, content, colaborators, time } = bodyRequest;

    const result = await this.createEventUseCase.execute({
      Id: sub,
      title,
      content,
      colaborators,
      time,
      body: file.buffer,
      mimeType: file.mimetype,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case EventAreNotExitsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
