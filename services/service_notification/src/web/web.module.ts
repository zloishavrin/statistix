import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WebGateway } from './web.gateway';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [ConfigModule, JwtModule.register({}), QueueModule],
  providers: [WebGateway],
})
export class WebModule {}
