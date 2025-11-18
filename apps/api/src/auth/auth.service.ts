import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
  ) {}

  private async createAuthResponse(
    userId: number,
    userName: string,
  ): Promise<AuthResponseDto> {
    await this.authRepository.deactivateUserTokens(userId);

    const token = this.authRepository.generateToken();
    await this.authRepository.createToken(userId, token);

    return {
      token,
      user: {
        id: userId,
        name: userName,
      },
    };
  }

  async login(name: string, password: string): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByName(name);

    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = await this.usersService.verifyPassword(
      password,
      existingUser.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.createAuthResponse(existingUser.id, existingUser.name);
  }

  async register(name: string, password: string): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByName(name);

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = await this.usersService.create(name, password);
    await this.usersService.getOrCreateRole(newUser.id, name);

    return this.createAuthResponse(newUser.id, newUser.name);
  }

  async loginOrRegister(
    name: string,
    password: string,
  ): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByName(name);

    if (existingUser) {
      return this.login(name, password);
    }

    return this.register(name, password);
  }

  async logout(token: string): Promise<void> {
    const deactivated = await this.authRepository.deactivateToken(token);

    if (!deactivated) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
