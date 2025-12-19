import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

import { User } from "./user.model";

@Schema({
  collection: "Token",
})
export class Token {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  token: string;

  @Prop({
    required: true,
    type: Date,
  })
  createdAt: Date;
}

export type TokenDocument = HydratedDocument<Token>;
export const TokenSchema = SchemaFactory.createForClass(Token);
