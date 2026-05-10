import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelModel, Channel, ConsumeMessage } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { QueueMessageDto } from './dtos/queue-message.dto';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private exchange = 'tasks-exchange';
  private routingKey = 'tasks';
  private notificationRoutingKey = 'notification';

  private connection?: ChannelModel;
  private channel?: Channel;
  private isReconnecting = false;

  private handlers?: ((data: QueueMessageDto) => void)[];

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const queueUser = this.configService.getOrThrow<string>('rabbitmq.user');
    const queuePassword =
      this.configService.getOrThrow<string>('rabbitmq.password');
    await this.connectWithRetry(queueUser, queuePassword);
  }

  async onModuleDestroy() {
    await this.channel?.close();
  }

  /**
   * Set handlers for notification
   * @param handler handler for notification
   */
  setHandler(handler: (data: QueueMessageDto) => void) {
    if (!this.handlers) {
      this.handlers = [handler];
    } else {
      this.handlers = [...this.handlers, handler];
    }

    void this.startConsumers();
  }

  /**
   * Start result and failed task consumers
   */
  private async startConsumers() {
    if (!this.channel) return;
    if (!this.handlers) return;

    await this.consume(
      `${this.routingKey}.${this.notificationRoutingKey}`,
      'task-notification-queue',
    );
  }

  /**
   * Start consume from queue
   * @param routingKey Routing key for topic exchange
   * @param queueName Name of queue
   */
  private async consume(routingKey: string, queueName: string) {
    if (!this.channel) return;

    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queueName, this.exchange, routingKey);

    await this.channel.consume(queueName, (message: ConsumeMessage | null) => {
      void (async () => {
        if (!message) return;

        try {
          const data: unknown = JSON.parse(message.content.toString());
          const dto = plainToInstance(QueueMessageDto, data);
          await validateOrReject(dto as object);

          for (const handler of this.handlers!) {
            handler(dto);
          }

          this.channel!.ack(message);
        } catch {
          this.channel!.nack(message, false, false);
        }
      })();
    });
  }

  /**
   * Connect to RabbitMQ with retry
   * @param user RabbitMQ user
   * @param password RabbitMQ password
   * @param maxRetries Count of retries attempts
   * @param retryDelay Retry delay in ms
   */
  private async connectWithRetry(
    user: string,
    password: string,
    maxRetries: number = 10,
    retryDelay: number = 3000,
  ) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.connect(user, password);
        this.setupErrorHandlers(user, password);
        void this.startConsumers();
        return;
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await new Promise((r) => setTimeout(r, retryDelay));
      }
    }
  }

  /**
   * Connect to RabbitMQ
   * @param user RabbitMQ user
   * @param password RabbitMQ password
   */
  private async connect(user: string, password: string): Promise<void> {
    const url = `amqp://${user}:${password}@rabbitmq:5672`;
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(this.exchange, 'topic', {
      durable: true,
    });
  }

  /**
   * Setup error handlers for reconnection
   * @param user RabbitMQ user
   * @param password RabbitMQ password
   */
  private setupErrorHandlers(user: string, password: string) {
    this.connection?.on('close', () => {
      void this.reconnect(user, password);
    });

    this.connection?.on('error', () => {
      void this.reconnect(user, password);
    });
  }

  /**
   * Reconnect to RabbitMQ
   * @param user RabbitMQ user
   * @param password RabbitMQ password
   */
  private async reconnect(user: string, password: string) {
    if (this.isReconnecting) return;

    this.isReconnecting = true;
    try {
      await this.connectWithRetry(user, password);
    } finally {
      this.isReconnecting = false;
    }
  }
}
