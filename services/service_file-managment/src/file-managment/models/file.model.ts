import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FileType } from '../types/file-types.enum';

@Schema({
  collection: 'File',
})
export class File {
  @Prop({
    required: true,
    type: Types.ObjectId,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  key: string;

  @Prop({
    required: true,
    type: String,
    enum: FileType,
  })
  type: FileType;

  @Prop({
    required: true,
    type: Number,
  })
  size: number;

  @Prop({
    required: true,
    type: String,
  })
  originalName: string;

  @Prop({
    required: true,
    type: Date,
  })
  createdAt: Date;
}

export type FileDocument = HydratedDocument<File>;
export const FileSchema = SchemaFactory.createForClass(File);
