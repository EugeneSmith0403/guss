import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchScoreDto {
  @ApiProperty()
  @IsNumber()
  increment: number;
}
