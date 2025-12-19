import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  collection: "User",
})
export class User {
  @Prop({
    required: true,
    type: String,
  })
  login: string;

  @Prop({
    required: true,
    type: String,
  })
  loginIV: string;

  @Prop({
    required: true,
    type: String,
  })
  loginHmac: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    required: true,
    type: Date,
  })
  createdAt: Date;

  @Prop({
    required: true,
    type: Date,
  })
  updatedAt: Date;

  @Prop({
    required: true,
    type: Boolean,
  })
  isDeleted: boolean;

  @Prop({
    required: false,
    type: Date,
  })
  deletedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
