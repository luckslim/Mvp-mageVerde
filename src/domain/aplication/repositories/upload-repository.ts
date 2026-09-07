import { Upload } from '@/domain/enterprise/entities/upload';

export abstract class UploadRepository {
  abstract upload(upload: Upload): Promise<{ result: string }>;
  abstract deleteUpload(url: string): Promise<void>;
}
