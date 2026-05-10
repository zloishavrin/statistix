import { Module } from '@nestjs/common';
import configuration from 'src/config/config.factory';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from '../queue/queue.module';
import { WebModule } from '../web/web.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    QueueModule,
    WebModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
