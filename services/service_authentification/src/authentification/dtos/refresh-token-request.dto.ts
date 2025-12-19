import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class RefreshTokenRequestDto {
  @ApiProperty({
    required: true,
    type: String,
    description: "Refresh token",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.isString") })
  refreshToken: string;
}
