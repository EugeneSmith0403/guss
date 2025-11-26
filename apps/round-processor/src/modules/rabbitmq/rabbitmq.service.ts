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
import { ConfigService } from '@nestjs/config';

type ConsumeHandler<T> = (data: T) => Promise<void>;

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitService.name);
  private connection: AmqpConnectionManager | null = null;
  private channelWrapper: ChannelWrapper | null = null;

  constructor(
    private readonly configService: ConfigService,
  ) {

  }

  async onModuleInit(): Promise<void> {
    const url = this.configService.get('roundProcessor.rabbitmq.url');
    const urls = url.split(',');

    const maskedUrls = urls.map((u) => {
      try {
        const urlObj = new URL(u);
        if (urlObj.password) {
          urlObj.password = '***';
        }
        return urlObj.toString();
      } catch {
        return u.replace(/:[^:@]+@/, ':***@');
      }
    });

    this.logger.log(`Connecting to RabbitMQ at: ${maskedUrls.join(', ')}`);
    this.logger.debug(`Full RabbitMQ URL from config: ${url}`);

    this.connection = connect(urls);
    this.connection.on('connect', () =>
      this.logger.log('RabbitMQ connection established'),
    );
    this.connection.on('disconnect', ({ err }) =>
      this.logger.error('RabbitMQ disconnected', err),
    );
    this.connection.on('connectFailed', ({ err, url }) =>
      this.logger.error(`Failed to connect to RabbitMQ at ${url}`, err),
    );

    this.channelWrapper = this.connection.createChannel({
      json: false,
      setup: async (channel: Channel) => {
        channel.on('return', (message) => {
          this.logger.error(
            `Message returned (not routed): ${message.content.toString()}`,
          );
        });
        
        this.logger.log('RabbitMQ channel configured');
      },
    });

    this.channelWrapper.on('connect', () =>
      this.logger.log('RabbitMQ channel created'),
    );
    this.channelWrapper.on('error', (err) =>
      this.logger.error('RabbitMQ channel error', err),
    );
    this.channelWrapper.on('close', () =>
      this.logger.warn('RabbitMQ channel closed'),
    );
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
      this.logger.log(`Queue "${queue}" asserted`);
    });
  }

  async sendToQueue(queue: string, payload: unknown): Promise<void> {
    this.ensureChannelInitialized();

    await this.assertQueue(queue);

    const buffer = Buffer.from(JSON.stringify(payload));

    try {
      await this.channelWrapper!.addSetup(async (channel: Channel) => {
        await channel.assertQueue(queue, { durable: true });

        const sent = channel.sendToQueue(queue, buffer, {
          persistent: true,
        });

        if (!sent) {
          throw new Error('Failed to send message: channel buffer is full');
        }
      });

      this.logger.debug(`Message sent to queue "${queue}"`);
    } catch (error) {
      this.logger.error(
        `Failed to send message to queue "${queue}": ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async consume<T>(
    queue: string,
    handler: ConsumeHandler<T>,
  ): Promise<void> {

    this.logger.log(`Consuming messages from queue "${queue}"`);
    this.ensureChannelInitialized();

    await this.channelWrapper!.addSetup(async (channel: Channel) => {
      await channel.assertQueue(queue, {
        durable: true,
      });

      await channel.prefetch(10);

      await channel.consume(
        queue,
        async (message: ConsumeMessage | null) => {
          if (!message) {
            return;
          }

          try {
            const data = JSON.parse(message.content.toString()) as T;
            await handler(data);
            channel.ack(message);
            this.logger.debug(
              `Message from queue "${queue}" processed and acknowledged`,
            );
          } catch (error) {
            this.logger.error(
              `Failed to process message from queue "${queue}"`,
              error as Error,
            );
            channel.nack(message, false, false);
          }
        },
        {
          noAck: false,
        },
      );
      this.logger.log(`Started consuming from queue "${queue}" with manual ack`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channelWrapper?.close();
    await this.connection?.close();
  }
}

