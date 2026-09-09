import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { EnvService } from '../env/env.service';
import { Inject, Injectable } from '@nestjs/common';
import { UploadRepository } from '@/domain/aplication/repositories/upload-repository';
import { Upload } from '@/domain/enterprise/entities/upload';

@Injectable()
export class R2Storage implements UploadRepository {
  private client: S3Client;
  constructor(@Inject(EnvService) private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID');
    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_KET_ID'),
      },
    });
  }
  async upload({
    body,
    fileName,
    mimeType,
  }: Upload): Promise<{ result: string }> {
    const httpFileKey = this.envService.get('HTTP_FILE_KEY');

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: fileName,
        ContentType: mimeType,
        Body: body,
      }),
    );
    return {
      result: `${httpFileKey}/${fileName}`,
    };
  }
  async deleteUpload(url: string): Promise<void> {
    const fileName = url.split('/').pop();

    if (!fileName) {
      throw new Error(`URL de arquivo inválida: ${url}`);
    }

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: fileName,
      }),
    );
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.envService.get('AWS_BUCKET_NAME'),
          Key: fileName,
        }),
      );

      throw new Error(`Não foi possível excluir o arquivo: ${fileName}`);
    } catch (error: any) {
      if (
        error?.name === 'NotFound' ||
        error?.$metadata?.httpStatusCode === 404
      ) {
        return;
      }

      throw error;
    }
  }
}
