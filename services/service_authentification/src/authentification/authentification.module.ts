import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { CryptModule } from "src/crypt/crypt.module";

import { Token, TokenSchema } from "./models/token.model";
import { User, UserSchema } from "./models/user.model";
import { AuthentificationController } from "./authentification.controller";
import { AuthentificationService } from "./authentification.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    JwtModule.register({}),
    ConfigModule,
    CryptModule,
  ],
  controllers: [AuthentificationController],
  providers: [AuthentificationService],
})
export class AuthentificationModule {}
