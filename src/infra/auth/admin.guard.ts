import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import type { TokenPayloadSchema } from './jwt-strategy';

type AuthenticatedRequest = Request & {
  user?: TokenPayloadSchema;
};

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user?.role === 'admin';
  }
}
