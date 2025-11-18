import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/db';
import { User, UserRole } from '@prisma/client';
import type { UserWithRoles } from '../interfaces/user.interface';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<UserWithRoles | null> {
    return this.prisma.user.findFirst({
      where: { name },
      include: { roles: true },
    });
  }

  async findById(id: number): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
  }

  async create(
    name: string,
    password: string,
    createdAt: number,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        name,
        password,
        createdAt,
      },
    });
  }

  async createRole(userId: number, role: string): Promise<UserRole> {
    return this.prisma.userRole.create({
      data: {
        userId,
        role,
      },
    });
  }
}
