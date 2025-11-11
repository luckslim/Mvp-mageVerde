import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/user-controllers/create-user-controller';
import { CreateUserUseCase } from '@/domain/aplication/use-cases/users/create-user-use-case';

@Module({
  controllers: [CreateUserController],
  providers: [CreateUserUseCase],
})
export class HttpModule {}
