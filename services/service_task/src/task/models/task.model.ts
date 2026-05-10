import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TaskColumns } from './task-column.model';
import { TaskParam } from './task-param.model';
import { TaskStatus } from './task-status.model';
import { TaskResult } from './task-result.model';

@Schema({
  collection: 'Task',
})
export class Task {
  @Prop({
    required: true,
    type: Types.ObjectId,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  extension: string;

  @Prop({
    required: true,
    type: String,
  })
  method: string;

  @Prop({
    required: false,
    type: TaskColumns,
  })
  inputColumns?: TaskColumns;

  @Prop({
    required: false,
    type: [TaskParam],
  })
  inputParams?: TaskParam[];

  @Prop({
    required: true,
    type: String,
    enum: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.FAILED],
  })
  status: TaskStatus;

  @Prop({
    required: false,
    type: String,
  })
  errorMessage?: string;

  @Prop({
    required: false,
    type: TaskResult,
  })
  result?: TaskResult;

  @Prop({
    required: true,
    type: Date,
  })
  createdAt: Date;

  @Prop({
    required: false,
    type: Date,
  })
  completedAt?: Date;
}

export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);
