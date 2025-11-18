import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/db';
import { Round, RoundUser, RoundStatus } from '@prisma/client';
import type {
  RoundWithUsers,
  RoundWithUsersAndUserData,
} from '../interfaces/round.interface';

@Injectable()
export class RoundsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    start: number,
    end: number,
    status: RoundStatus,
  ): Promise<Round> {
    return this.prisma.round.create({
      data: {
        start,
        end,
        status,
      },
    });
  }

  async findById(id: string): Promise<RoundWithUsers | null> {
    return this.prisma.round.findUnique({
      where: { id },
      include: {
        users: true,
        winnerUser: true,
      },
    });
  }

  async findByIdWithUser(
    id: string,
    userId: number,
  ): Promise<RoundWithUsersAndUserData | null> {
    return this.prisma.round.findUnique({
      where: { id },
      include: {
        users: {
          include: { user: true },
        },
        winnerUser: true,
      },
    });
  }

  async findAll(): Promise<Round[]> {
    return this.prisma.round.findMany({
      include: {
        users: true,
        winnerUser: true,
      },
      orderBy: { start: 'desc' },
    });
  }

  async findActive(): Promise<Round[]> {
    return this.prisma.round.findMany({
      where: { status: RoundStatus.active },
      include: {
        users: true,
        winnerUser: true,
      },
      orderBy: { start: 'desc' },
    });
  }

  async updateStatus(id: string, status: RoundStatus): Promise<Round> {
    return this.prisma.round.update({
      where: { id },
      data: { status },
    });
  }

  async updateTotalScore(id: string, totalScore: number): Promise<Round> {
    return this.prisma.round.update({
      where: { id },
      data: { totalScore },
    });
  }

  async setWinner(id: string, winnerId: number): Promise<Round> {
    return this.prisma.round.update({
      where: { id },
      data: { winnerId },
    });
  }

  async createRoundUser(
    roundId: string,
    userId: number,
    score: number,
  ): Promise<RoundUser> {
    return this.prisma.roundUser.create({
      data: {
        roundId,
        userId,
        score,
      },
    });
  }
}
