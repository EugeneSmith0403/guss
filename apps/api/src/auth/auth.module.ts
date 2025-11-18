import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { UsersModule } from '../users/users.module';
import { TokenAuthGuard } from './guards/token-auth.guard';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, TokenAuthGuard],
  exports: [AuthRepository],
})
export class AuthModule {}
