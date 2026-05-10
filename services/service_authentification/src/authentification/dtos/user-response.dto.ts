import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class UserResponseDto {
  @ApiProperty({
    required: true,
    type: String,
    description: "User ID",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.isString") })
  id: string;

  @ApiProperty({
    required: true,
    type: String,
    description: "User login",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.isString") })
  login: string;
}
