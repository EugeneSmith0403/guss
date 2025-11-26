import { Injectable } from '@nestjs/common';
import { RoundStatus } from '@prisma/client';
import { PrismaService } from '@shared/db';

export type FinishedRound = {
  id: string;
  end: number;
};

export type RoundUserScore = {
  userId: number;
  score: number;
};

@Injectable()
export class RoundRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFinishedRounds(timestamp: number): Promise<FinishedRound[]> {
    return this.prisma.round.findMany({
      where: {
        status: { not: RoundStatus.complete },
        end: { lte: timestamp },
      },
      select: {
        id: true,
        end: true,
      },
    });
  }

  async upsertRoundUsers(
    roundId: string,
    users: RoundUserScore[],
  ): Promise<void> {
    if (!users.length) {
      return;
    }

    await this.prisma.$transaction(
      users.map(({ userId, score }) =>
        this.prisma.roundUser.upsert({
          where: {
            roundId_userId: {
              roundId,
              userId,
            },
          },
          create: {
            roundId,
            userId,
            score,
          },
          update: {
            score,
          },
        }),
      ),
    );
  }

  async completeRound(
    roundId: string,
    totalScore: number,
    winnerId?: number | null,
  ): Promise<void> {
    await this.prisma.round.update({
      where: { id: roundId },
      data: {
        totalScore,
        winnerId,
        status: RoundStatus.complete,
      },
    });
  }
}

