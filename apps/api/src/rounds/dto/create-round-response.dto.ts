import { ApiProperty } from '@nestjs/swagger';
import type { CreateRoundResponse } from '@guss/shared/api-contracts';

export class CreateRoundResponseDto implements CreateRoundResponse {
  @ApiProperty()
  id: string;
}
