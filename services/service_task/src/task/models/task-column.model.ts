import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  _id: false,
})
export class TaskColumn {
  @Prop({
    required: true,
    type: String,
  })
  column: string;

  @Prop({
    required: true,
    type: Number,
  })
  index: number;
}

@Schema({
  _id: false,
})
export class TaskMultipleColumn {
  @Prop({
    required: true,
    type: String,
  })
  column: string;

  @Prop({
    required: true,
    type: [Number],
  })
  index: number[];
}

@Schema({
  _id: false,
})
export class TaskColumns {
  @Prop({
    required: true,
    type: Types.ObjectId,
  })
  file: Types.ObjectId;

  @Prop({
    required: false,
    type: [TaskMultipleColumn],
  })
  multipleColumns?: TaskMultipleColumn[];

  @Prop({
    required: false,
    type: [TaskColumn],
  })
  columns?: TaskColumn[];
}
