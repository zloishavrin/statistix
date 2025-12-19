import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { I18n, I18nContext } from "nestjs-i18n";
import { SuccessfulResponseDto } from "src/common/dtos/successful-response.dto";

import { Token } from "./decorators/token.decorator";
import { LoginRequestDto } from "./dtos/login-request.dto";
import { LoginResponseDto } from "./dtos/login-response.dto";
import { RegistrationRequestDto } from "./dtos/registration-request.dto";
import { AuthentificationService } from "./authentification.service";

@ApiTags("Authentification")
@Controller("")
export class AuthentificationController {
  constructor(private authentificationService: AuthentificationService) {}

  @Post("registration")
  @ApiOperation({ summary: "Registration" })
  @ApiOkResponse({
    description: "Successful message",
    type: SuccessfulResponseDto,
  })
  async registration(
    @Body() body: RegistrationRequestDto,
    @I18n() i18n: I18nContext,
  ): Promise<SuccessfulResponseDto> {
    return this.authentificationService.registration(body, i18n);
  }

  @Post("login")
  @ApiOperation({ summary: "Login" })
  @ApiOkResponse({
    description: "Refresh and Access tokens",
    type: LoginResponseDto,
  })
  async login(
    @Body() body: LoginRequestDto,
    @I18n() i18n: I18nContext,
  ): Promise<LoginResponseDto> {
    return this.authentificationService.login(body, i18n);
  }

  @Post("logout")
  @ApiOperation({ summary: "Logout" })
  @ApiOkResponse({
    description: "Successful message",
    type: SuccessfulResponseDto,
  })
  async logout(
    @Token() token: string | null,
    @I18n() i18n: I18nContext,
  ): Promise<SuccessfulResponseDto> {
    return this.authentificationService.logoutAllDevices(token, i18n);
  }

  @Post("validate")
  @ApiOperation({ summary: "Validation for Access token" })
  @ApiOkResponse({
    description: "User ID",
    type: String,
  })
  async validate(
    @Token() token: string | null,
    @I18n() i18n: I18nContext,
  ): Promise<string> {
    return this.authentificationService.validateToken(token, i18n);
  }
}
