import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { File, FileSchema } from "./models/file.model";
import { StorageModule } from "src/storage/storage.module";
import { FileManagmentController } from "./file-managment.controller";
import { FileManagmentService } from "./file-managment.service";
import { FileManagmentMapper } from "./file-managment.mapper";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema },
    ]),
    ConfigModule,
    StorageModule,
  ],
  controllers: [FileManagmentController],
  providers: [FileManagmentService, FileManagmentMapper],
})
export class FileManagmentModule {}
