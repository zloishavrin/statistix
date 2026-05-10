import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { QueueService } from '../queue/queue.service';
import { QueueMessageDto } from '../queue/dtos/queue-message.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/types/jwt-payload.types';

@WebSocketGateway({
  path: '/notification',
  cors: {
    origin: '*',
  },
})
export class WebGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly queueService: QueueService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>('jwt.secret');
  }

  onModuleInit() {
    this.queueService.setHandler((data) => this.handleNotification(data));
  }

  handleNotification(data: QueueMessageDto) {
    this.server.to(data.userId).emit('notification', {
      id: data.taskId,
      title: data.taskTitle,
      status: data.status,
    });
  }

  handleConnection(client: Socket) {
    const { token } = client.handshake.auth;

    try {
      if (typeof token !== 'string') {
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.jwtSecret,
      });

      const userId = payload.sub;

      void client.join(userId);
    } catch (error) {
      console.error(error);
    }
  }
}
