import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { TokenAuthGuard } from './guards/token-auth.guard';
import type { AuthenticatedRequest } from './interfaces/request.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login or Register' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponseDto })
  async loginOrRegister(@Body() dto: AuthDto): Promise<AuthResponseDto> {
    return this.authService.loginOrRegister(dto.name, dto.password);
  }

  @Post('logout')
  @UseGuards(TokenAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current session' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Token deactivated' })
  async logout(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.authService.logout(req.token);
  }
}
