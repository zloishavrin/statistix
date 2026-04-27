import { ApiProperty } from "@nestjs/swagger";

export class FileResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: "File ID",
  })
  id: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: "File size in bytes",
  })
  size: number;

  @ApiProperty({
    type: String,
    required: true,
    description: "File name",
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: "File creation date (ISO)",
  })
  createdAt: string;
}