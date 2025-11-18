import { ApiProperty } from '@nestjs/swagger';
import type { AuthResponse } from '@guss/shared/api-contracts';

export class AuthResponseDto implements AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: {
    id: number;
    name: string;
  };
}
