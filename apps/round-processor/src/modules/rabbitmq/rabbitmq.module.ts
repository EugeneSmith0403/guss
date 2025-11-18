import { Global, Module } from '@nestjs/common';
import { RabbitService } from './rabbitmq.service';

@Global()
@Module({
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {}

