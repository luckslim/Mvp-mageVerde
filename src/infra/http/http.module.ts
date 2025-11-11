import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/user-controllers/create-user-controller';
import { CreateUserUseCase } from '@/domain/aplication/use-cases/users/create-user-use-case';
import { DatabaseModule } from '@/database/databse.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserController],
  providers: [CreateUserUseCase],
})
export class HttpModule {}
