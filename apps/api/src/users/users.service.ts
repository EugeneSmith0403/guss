import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import * as bcrypt from 'bcrypt';
import { transliterate } from './users.utils';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByName(name: string) {
    return this.usersRepository.findByName(name);
  }

  async findById(id: number) {
    return this.usersRepository.findById(id);
  }

  async create(name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = Math.floor(Date.now() / 1000);
    return this.usersRepository.create(name, hashedPassword, createdAt);
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getOrCreateRole(userId: number, userName: string): Promise<string> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.roles.length > 0) {
      return user.roles[0].role;
    }

    const role = this.determineUserRole(userName);
    await this.usersRepository.createRole(userId, role);
    return role;
  }

  private determineUserRole(userName: string): string {
    if (userName === 'admin' || userName === 'nikita') {
      return userName;
    }
    return transliterate(userName);
  }
}
