import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  refreshToken: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  accessToken: string;
}
