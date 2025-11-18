import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
} from '@nestjs/common';
import { RoundsService } from '../../rounds/rounds.service';

@Injectable()
export class RoundActiveGuard implements CanActivate {
  constructor(private readonly roundsService: RoundsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roundId = request.params.roundId;

    const round = await this.roundsService.findOne(roundId);

    if (!round || round.status !== 'active') {
      throw new ConflictException('Round is not active');
    }

    return true;
  }
}
