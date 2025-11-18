import { ApiProperty } from '@nestjs/swagger';
import type { RoundScoreResponse } from '@guss/shared/api-contracts';

export class RoundScoreResponseDto implements RoundScoreResponse {
  @ApiProperty()
  score: number;
}
