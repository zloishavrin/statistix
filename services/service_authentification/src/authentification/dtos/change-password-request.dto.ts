import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class ChangePasswordRequestDto {
  @ApiProperty({
    required: true,
    type: String,
    description: "Current password",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.isString") })
  currentPassword: string;

  @ApiProperty({
    required: true,
    type: String,
    description: "New password",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.isString") })
  newPassword: string;
}
