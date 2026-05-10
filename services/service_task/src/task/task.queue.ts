import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelModel, Channel, ConsumeMessage } from 'amqplib';
import { TaskQueueRequest } from './interfaces/task-queue-request.interface';
import {
  TaskQueueFailedResponseDto,
  TaskQueueResponseDto,
} from './dtos/task-queue-response.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class TaskQueue implements OnModuleInit, OnModuleDestroy {
  private exchange = 'tasks-exchange';
  private routingKey = 'tasks';
  private notificationRoutingKey = 'notification';

  private connection?: ChannelModel;
  private channel?: Channel;
  private isReconnecting = false;

  private resultHandler?: (data: TaskQueueResponseDto) => Promise<void>;
  private failedHandler?: (data: TaskQueueFailedResponseDto) => Promise<void>;

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
   * Set handlers for result and failed tasks response
   * @param resultHandler handler for result task
   * @param failedHandler handler for failed task
   */
  setHandlers(
    resultHandler: (data: TaskQueueResponseDto) => Promise<void>,
    failedHandler: (data: TaskQueueFailedResponseDto) => Promise<void>,
  ) {
    this.resultHandler = resultHandler;
    this.failedHandler = failedHandler;
    void this.startConsumers();
  }

  /**
   * Emit task in queue
   * @param routingKey Key for routing task in worker
   * @param payload Task data
   */
  emit(routingKey: string, payload: TaskQueueRequest): void {
    if (this.channel) {
      const fullRoutingKey = `${this.routingKey}.${routingKey}`;

      this.channel.publish(
        this.exchange,
        fullRoutingKey,
        Buffer.from(JSON.stringify(payload)),
        {
          contentType: 'application/json',
          deliveryMode: 2,
        },
      );
    }
  }

  emitNotification(
    taskId: string,
    userId: string,
    taskTitle: string,
    status: 'completed' | 'failed',
  ) {
    if (this.channel) {
      const fullRoutingKey = `${this.routingKey}.${this.notificationRoutingKey}`;
      const payload = { taskId, userId, taskTitle, status };

      this.channel.publish(
        this.exchange,
        fullRoutingKey,
        Buffer.from(JSON.stringify(payload)),
        {
          contentType: 'application/json',
          persistent: true,
        },
      );
    }
  }

  /**
   * Start result and failed task consumers
   */
  private async startConsumers() {
    if (!this.channel) return;
    if (!this.resultHandler || !this.failedHandler) return;

    await this.consume<TaskQueueResponseDto>(
      'tasks.results',
      'task-results-queue',
      TaskQueueResponseDto,
      this.resultHandler,
    );
    await this.consume<TaskQueueFailedResponseDto>(
      'tasks.failed',
      'task-failed-queue',
      TaskQueueFailedResponseDto,
      this.failedHandler,
    );
  }

  /**
   * Start consume from queue
   * @param routingKey Routing key for topic exchange
   * @param queueName Name of queue
   * @param cls Class for dto
   * @param handler Function for handling task
   */
  private async consume<T>(
    routingKey: string,
    queueName: string,
    cls: new () => T,
    handler: (data: T) => Promise<void>,
  ) {
    if (!this.channel) return;

    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queueName, this.exchange, routingKey);

    await this.channel.consume(queueName, (message: ConsumeMessage | null) => {
      void (async () => {
        if (!message) return;

        try {
          const data: unknown = JSON.parse(message.content.toString());
          const dto = plainToInstance(cls, data);
          await validateOrReject(dto as object);
          await handler(dto);
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
