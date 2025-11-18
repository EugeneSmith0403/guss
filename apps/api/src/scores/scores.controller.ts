import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ScoresService } from './scores.service';
import { BatchScoreDto } from './dto/batch-score.dto';
import { RoundScoreResponseDto } from './dto/round-score-response.dto';
import { TokenAuthGuard } from '../auth/guards/token-auth.guard';
import { UserMatchGuard } from './guards/user-match.guard';
import { RoundActiveGuard } from './guards/round-active.guard';

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Patch('rounds/:roundId/users/:userId')
  @UseGuards(TokenAuthGuard, UserMatchGuard, RoundActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Increment user score by 1 (or 10 on 11th click)' })
  @ApiResponse({ status: HttpStatus.OK, type: RoundScoreResponseDto })
  async increment(
    @Param('roundId') roundId: string,
    @Param('userId') userId: number,
  ): Promise<RoundScoreResponseDto> {
    return this.scoresService.incrementScore(roundId, userId);
  }

  @Patch('rounds/:roundId/users/:userId/batch')
  @UseGuards(TokenAuthGuard, UserMatchGuard, RoundActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch increment user score (offline mode)' })
  @ApiResponse({ status: HttpStatus.OK, type: RoundScoreResponseDto })
  async batchIncrement(
    @Param('roundId') roundId: string,
    @Param('userId') userId: number,
    @Body() dto: BatchScoreDto,
  ): Promise<RoundScoreResponseDto> {
    return this.scoresService.batchIncrement(roundId, userId, dto.increment);
  }
}
