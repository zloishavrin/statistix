import { Prop, Schema } from '@nestjs/mongoose';
import { TaskParam } from './task-param.model';
import { TaskColumns } from './task-column.model';

@Schema({
  _id: false,
})
export class TaskResult {
  @Prop({
    required: false,
    type: [TaskParam],
  })
  params?: TaskParam[];

  @Prop({
    required: false,
    type: TaskColumns,
  })
  columns?: TaskColumns;
}
