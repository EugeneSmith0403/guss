import { Injectable } from '@nestjs/common';
import { RoundsRepository } from './repository/rounds.repository';
import { RedisService } from '@shared/redis';
import type { Round } from '@guss/shared/types';
import { RoundStatus } from '@prisma/client';
import { getRoundDurations } from './rounds.config';
import {
  getCurrentUnixTimeSeconds,
  calculateRoundStatus,
} from './rounds.utils';

@Injectable()
export class RoundsService {
  constructor(
    private readonly roundsRepository: RoundsRepository,
    private readonly redisService: RedisService,
  ) {}

  private getUserScoreKey(roundId: string, userId: number): string {
    return `round:${roundId}:user:${userId}:scores`;
  }

  private getTotalScore(roundId: string): string {
    return `round:${roundId}:totalScore`;
  }

  async create(): Promise<{ id: string }> {
    const now = getCurrentUnixTimeSeconds();
    const durations = getRoundDurations();
    const start = now + durations.cooldown;
    const end = start + durations.duration;
    const round = await this.roundsRepository.create(
      start,
      end,
      RoundStatus.cooldown,
    );

    return { id: round.id };
  }

  async findAll(): Promise<Round[]> {
    const rounds = await this.roundsRepository.findAll();
    const now = getCurrentUnixTimeSeconds();

    return rounds.map((round) => ({
      id: round.id,
      start: round.start,
      end: round.end,
      status: calculateRoundStatus(round.status, round.start, round.end, now),
      totalScore: round.totalScore,
      winnerId: round.winnerId || undefined,
    }));
  }

  async findOne(id: string): Promise<Round | null> {
    const round = await this.roundsRepository.findById(id);
    if (!round) {
      return null;
    }

    const now = getCurrentUnixTimeSeconds();

    return {
      id: round.id,
      start: round.start,
      end: round.end,
      status: calculateRoundStatus(round.status, round.start, round.end, now),
      totalScore: round.totalScore,
      winnerId: round.winnerId || undefined,
    };
  }

  async findOneWithUser(id: string, userId: number): Promise<Round | null> {
    const round = await this.roundsRepository.findByIdWithUser(id, userId);
    if (!round) {
      return null;
    }

    const now = getCurrentUnixTimeSeconds();
    const userScoreKey = this.getUserScoreKey(id, userId);
    const redisUserScore = await this.redisService.get(userScoreKey);
    const redisTotalScore = await this.redisService.get(this.getTotalScore(id));

    const userRoundData = round.users.find((ru) => ru.userId === userId);
    const winnerRoundData = round.winnerId
      ? round.users.find((ru) => ru.userId === round.winnerId)
      : null;

    const userRound = userRoundData || redisUserScore
      ? {
          roundId: round.id,
          userId: userRoundData?.userId ?? userId,
          score: userRoundData?.score || Number(redisUserScore) || 0,
          userName: userRoundData?.user?.name || '',
        }
      : undefined;

    const winner = round.winnerUser && winnerRoundData
      ? {
          id: round.winnerUser.id,
          name: round.winnerUser.name,
          score: winnerRoundData.score ?? 0,
        }
      : undefined;

    return {
      id: round.id,
      start: round.start,
      end: round.end,
      status: calculateRoundStatus(round.status, round.start, round.end, now),
      totalScore: round.totalScore ?? Number(redisTotalScore) ?? 0,
      winnerId: round.winnerId || undefined,
      userRound,
      winner,
    };
  }

  async getActiveRound(): Promise<{ id: string; end: number } | null> {
    const rounds = await this.roundsRepository.findAll();
    const now = getCurrentUnixTimeSeconds();

    for (const round of rounds) {
      const persistedStatus = round.status;

      if (
        persistedStatus === RoundStatus.cooldown &&
        now >= round.start &&
        now < round.end
      ) {
        return { id: round.id, end: round.end };
      }
    }

    return null;
  }
}
