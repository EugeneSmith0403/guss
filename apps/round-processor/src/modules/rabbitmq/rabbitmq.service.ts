import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  AmqpConnectionManager,
  ChannelWrapper,
  connect,
} from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';
import { RABBITMQ_URL } from '@shared/config';

type ConsumeHandler<T> = (data: T) => Promise<void>;

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitService.name);
  private connection: AmqpConnectionManager | null = null;
  private channelWrapper: ChannelWrapper | null = null;

  async onModuleInit(): Promise<void> {
    const urls = RABBITMQ_URL.split(',');

    this.connection = connect(urls);
    this.connection.on('connect', () =>
      this.logger.log('RabbitMQ connection established'),
    );
    this.connection.on('disconnect', ({ err }) =>
      this.logger.error('RabbitMQ disconnected', err),
    );

    this.channelWrapper = this.connection.createChannel({
      json: false,
    });
  }

  private ensureChannelInitialized(): void {
    if (!this.channelWrapper) {
      throw new Error('RabbitMQ channel is not initialized');
    }
  }

  async assertQueue(queue: string): Promise<void> {
    this.ensureChannelInitialized();

    await this.channelWrapper!.addSetup(async (channel: Channel) => {
      await channel.assertQueue(queue, { durable: true });
    });
  }

  async sendToQueue(queue: string, payload: unknown): Promise<void> {
    this.ensureChannelInitialized();

    const buffer = Buffer.from(JSON.stringify(payload));

    await this.channelWrapper!.sendToQueue(queue, buffer, {
      persistent: true,
    });
  }

  async consume<T>(
    queue: string,
    handler: ConsumeHandler<T>,
  ): Promise<void> {
    this.ensureChannelInitialized();

    await this.channelWrapper!.addSetup(async (channel: Channel) => {
      await channel.assertQueue(queue, { durable: true });
      await channel.consume(queue, async (message: ConsumeMessage | null) => {
        if (!message) {
          return;
        }

        try {
          const data = JSON.parse(message.content.toString()) as T;
          await handler(data);
          channel.ack(message);
        } catch (error) {
          this.logger.error(
            `Failed to process message from queue "${queue}"`,
            error as Error,
          );
          channel.nack(message, false, false);
        }
      });
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channelWrapper?.close();
    await this.connection?.close();
  }
}

