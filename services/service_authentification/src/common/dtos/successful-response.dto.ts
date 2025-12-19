import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SuccessfulResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: "Message",
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
