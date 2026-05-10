import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExtensionService } from './extension.service';
import { ExtensionMapper } from './extension.mapper';
import { ExtensionController } from './extension.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ExtensionController],
  providers: [ExtensionService, ExtensionMapper],
  exports: [ExtensionService, ExtensionMapper],
})
export class ExtensionModule {}
