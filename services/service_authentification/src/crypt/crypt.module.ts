import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CryptService } from "./crypt.service";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [CryptService],
  exports: [CryptService],
})
export class CryptModule {}
