
import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/user-controllers/create-user-controller';

@Module({
  controllers: [CreateUserController],
})
export class HttpModule {}
