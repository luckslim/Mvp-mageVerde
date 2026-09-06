import { Upload } from '@/domain/enterprise/entities/upload';

export abstract class UploadRepository {
  abstract upload(upload: Upload): Promise<{ result: string }>;
  abstract deleteUpload(id: string): Promise<void>;
  abstract getSignedImageURL(id: string): Promise<string>;
}
