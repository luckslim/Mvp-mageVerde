import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/user-controllers/create-user-controller';
import { CreateUserUseCase } from '@/domain/aplication/use-cases/users/create-user-use-case';
import { DatabaseModule } from '@/infra/database/databse.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateUserController } from './controllers/user-controllers/authenticate-user-controller';
import { AuthenticateUserUseCase } from '@/domain/aplication/use-cases/users/authenticate-user-use-case';
import { DeleteUserController } from './controllers/user-controllers/delete-user-controller';
import { DeleteUserUseCase } from '@/domain/aplication/use-cases/users/delete-user-use-case';
import { EditUserController } from './controllers/user-controllers/edit-user-controller';
import { EditUserUseCase } from '@/domain/aplication/use-cases/users/edit-user-use-case';
import { AuthenticateAdminController } from './controllers/admin-controllers/authenticate-admin-controller';
import { AuthenticateAdminUseCase } from '@/domain/aplication/use-cases/admin/authenticate-admin-use-case';
import { CreateAdminController } from './controllers/admin-controllers/create-admin-controller';
import { CreateAdminUseCase } from '@/domain/aplication/use-cases/admin/create-admin-use-case';
import { DeleteAdminController } from './controllers/admin-controllers/delete-admin-controller';
import { DeleteAdminUseCase } from '@/domain/aplication/use-cases/admin/delete-admin-use-case';
import { EditAdminController } from './controllers/admin-controllers/edit-admin-controller';
import { EditAdminUseCase } from '@/domain/aplication/use-cases/admin/edit-admin-use-case';
import { CreateEventController } from './controllers/event-controllers/create-event-controller';
import { CreateEventUseCase } from '@/domain/aplication/use-cases/event/create-events-use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUserController,
    AuthenticateUserController,
    DeleteUserController,
    EditUserController,
    AuthenticateAdminController,
    CreateAdminController,
    DeleteAdminController,
    EditAdminController,
    CreateEventController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    DeleteUserUseCase,
    EditUserUseCase,
    AuthenticateAdminUseCase,
    CreateAdminUseCase,
    DeleteAdminUseCase,
    EditAdminUseCase,
    CreateEventUseCase,
  ],
})
export class HttpModule {}
