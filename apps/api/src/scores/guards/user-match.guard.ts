import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class UserMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = parseInt(request.params.userId, 10);
    const authUser = request.user;

    if (!authUser || authUser.id !== userId) {
      throw new ForbiddenException("You cannot modify another user's data");
    }

    const isAdmin =
      Array.isArray(authUser.roles) &&
      authUser.roles.some((role) => role.role === 'admin');

    if (isAdmin) {
      throw new ForbiddenException('Admins cannot increment scores');
    }

    return true;
  }
}
