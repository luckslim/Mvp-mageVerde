import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/user-controllers/create-user-controller';
import { CreateUserUseCase } from '@/domain/aplication/use-cases/users/create-user-use-case';
import { DatabaseModule } from '@/infra/database/databse.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateUserController } from './controllers/user-controllers/authenticate-user-controller';
import { AuthenticateUserUseCase } from '@/domain/aplication/use-cases/users/authenticate-user-use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserController, AuthenticateUserController],
  providers: [CreateUserUseCase, AuthenticateUserUseCase],
})
export class HttpModule {}
