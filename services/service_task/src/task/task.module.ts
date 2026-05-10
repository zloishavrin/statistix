import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ExtensionModule } from 'src/extension/extension.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './models/task.model';
import { File, FileSchema } from 'src/file/file.model';
import { TaskController } from './task.controller';
import { TaskMapper } from './task.mapper';
import { TaskQueue } from './task.queue';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: File.name, schema: FileSchema },
    ]),
    ConfigModule,
    ExtensionModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskMapper, TaskQueue],
})
export class TaskModule {}
