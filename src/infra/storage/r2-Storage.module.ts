import { UploadRepository } from '@/domain/aplication/repositories/upload-repository';
import { R2Storage } from './r2-Storage';
import { EnvModule } from '../env/env.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvModule],
  providers: [{ provide: UploadRepository, useClass: R2Storage }],
  exports: [UploadRepository],
})
export class StorageModule {}
