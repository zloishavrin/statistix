import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class TaskParam {
  @Prop({
    required: true,
    type: String,
  })
  param: string;

  @Prop({
    required: true,
    type: Number,
  })
  value: number;
}
