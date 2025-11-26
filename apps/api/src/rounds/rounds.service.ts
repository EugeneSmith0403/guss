import { Injectable } from '@nestjs/common';
import { RoundsRepository } from './repository/rounds.repository';
import { RedisService } from '@shared/redis';
import type { Round } from '@guss/shared/types';
import { RoundStatus } from '@prisma/client';

import {
  getCurrentUnixTimeSeconds,
  calculateRoundStatus,
} from './rounds.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoundsService {
  constructor(
    private readonly roundsRepository: RoundsRepository,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService
  ) {}

  private getUserScoreKey(roundId: string, userId: number): string {
    return `round:${roundId}:user:${userId}:scores`;
  }

  private getTotalScore(roundId: string): string {
    return `round:${roundId}:totalScore`;
  }

  async create(): Promise<{ id: string }> {
    const now = getCurrentUnixTimeSeconds();
    const rounds = this.configService.get('backend.rounds');
    
    if (!rounds) {
      throw new Error('Rounds config is not available');
    }
    
    const start = now + rounds.cooldown;
    const end = start + rounds.duration;
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
      winnerId: round.winnerId,
      winner: round.winnerId
        ? {
            id: round.winnerId,
          }
        : {},
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
      winnerId: round?.winnerId,
      winner: round.winnerId
        ? {
            id: round.winnerId,
          }
        : {},
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

    const userRound: Round['userRound'] = {
      roundId: round.id,
      userId: userRoundData?.userId ?? userId,
      score: userRoundData?.score ?? Number(redisUserScore) ?? 0,
      userName: userRoundData?.user?.name ?? '',
    };

    const winner: Round['winner'] = round.winnerId
      ? {
          id: round.winnerUser?.id ?? round.winnerId,
          name: round.winnerUser?.name ?? '',
          score: winnerRoundData?.score ?? 0,
        }
      : {};

    const winnerId = round.status !== RoundStatus.complete && now >= round.end ? undefined : round.winnerId

    return {
      id: round.id,
      start: round.start,
      end: round.end,
      status: calculateRoundStatus(round.status, round.start, round.end, now),
      totalScore: round.totalScore ?? Number(redisTotalScore) ?? 0,
      winnerId,
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
