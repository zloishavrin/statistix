import { Injectable } from "@nestjs/common";
import { CryptService } from "src/crypt/crypt.service";

import { UserResponseDto } from "./dtos/user-response.dto";
import { UserDocument } from "./models/user.model";

@Injectable()
export class AuthentificationMapper {
  constructor(private readonly cryptService: CryptService) {}

  toUserResponseDto(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      login: this.cryptService.decryptText({
        data: user.login,
        iv: user.loginIV,
      }),
    };
  }
}
