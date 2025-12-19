import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class LoginRequestDto {
  @ApiProperty({
    required: true,
    type: String,
    description: "User login",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.isString") })
  login: string;

  @ApiProperty({
    required: true,
    type: String,
    description: "User password",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.isString") })
  password: string;
}
