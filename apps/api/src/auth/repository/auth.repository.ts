import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/db';
import { UserAuth } from '@prisma/client';
import type { AuthRecordWithUser } from '../interfaces/auth.interface';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveToken(token: string): Promise<AuthRecordWithUser | null> {
    return this.prisma.userAuth.findFirst({
      where: { token, isActive: true },
      include: { user: { include: { roles: true } } },
    });
  }

  async deactivateUserTokens(userId: number): Promise<void> {
    await this.prisma.userAuth.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  async deactivateToken(token: string): Promise<boolean> {
    const result = await this.prisma.userAuth.updateMany({
      where: { token, isActive: true },
      data: { isActive: false },
    });

    return result.count > 0;
  }

  async createToken(userId: number, token: string): Promise<UserAuth> {
    return this.prisma.userAuth.create({
      data: {
        userId,
        token,
        isActive: true,
      },
    });
  }

  generateToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
