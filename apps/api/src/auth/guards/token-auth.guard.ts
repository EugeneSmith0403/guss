import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import type { AuthenticatedRequest } from '../interfaces/request.interface';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly authRepository: AuthRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.substring(7).trim();
    const authRecord = await this.authRepository.findActiveToken(token);

    if (!authRecord) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = authRecord.user;
    request.token = token;
    return true;
  }
}
