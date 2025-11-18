import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoundsService } from './rounds.service';
import { CreateRoundResponseDto } from './dto/create-round-response.dto';
import { TokenAuthGuard } from '../auth/guards/token-auth.guard';
import type { Round } from '@guss/shared/types';
import type { AuthenticatedRequest } from '../auth/interfaces/request.interface';

@ApiTags('rounds')
@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post()
  @UseGuards(TokenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new round' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateRoundResponseDto })
  async create(): Promise<CreateRoundResponseDto> {
    return this.roundsService.create();
  }

  @Get()
  @ApiOperation({ summary: 'Get all rounds' })
  @ApiResponse({ status: HttpStatus.OK, type: [Object] })
  async findAll(): Promise<Round[]> {
    return this.roundsService.findAll();
  }

  @Get(':id')
  @UseGuards(TokenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a round by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: Object })
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Round | null> {
    const userId = req.user.id;
    return this.roundsService.findOneWithUser(id, userId);
  }
}
