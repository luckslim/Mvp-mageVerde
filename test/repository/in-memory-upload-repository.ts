import { UploadRepository } from '@/domain/aplication/repositories/upload-repository';
import { Upload } from '@/domain/enterprise/entities/upload';

export class InMemoryUploadRepository implements UploadRepository {
  async upload(upload: Upload): Promise<{ result: string }> {
    return {
      result: 'Upload executado com sucesso',
    };
  }

  async deleteUpload(id: string): Promise<void> {
    console.log(`Delete executado para o upload: ${id}`);
  }

  async getSignedImageURL(id: string): Promise<string> {
    return `getSignedImageURL executado para o upload: ${id}`;
  }
}
