import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { type Response } from "express";
import { I18n, I18nContext } from "nestjs-i18n";
import { SuccessfulResponseDto } from "src/common/dtos/successful-response.dto";

import { Token } from "./decorators/token.decorator";
import { ChangePasswordRequestDto } from "./dtos/change-password-request.dto";
import { LoginRequestDto } from "./dtos/login-request.dto";
import { LoginResponseDto } from "./dtos/login-response.dto";
import { RefreshTokenRequestDto } from "./dtos/refresh-token-request.dto";
import { RegistrationRequestDto } from "./dtos/registration-request.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
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

  @Get("me")
  @ApiOperation({ summary: "Get information about self" })
  @ApiOkResponse({
    description: "Information about self",
    type: UserResponseDto,
  })
  async getMe(
    @Token() token: string,
    @I18n() i18n: I18nContext,
  ): Promise<UserResponseDto> {
    return this.authentificationService.getMe(token, i18n);
  }

  @Post("change-password")
  @ApiOperation({ summary: "Change password" })
  @ApiOkResponse({
    description: "Successful message",
    type: SuccessfulResponseDto,
  })
  async changePassword(
    @Body() body: ChangePasswordRequestDto,
    @Token() token: string,
    @I18n() i18n: I18nContext,
  ): Promise<SuccessfulResponseDto> {
    return this.authentificationService.changePassword(body, token, i18n);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh access token" })
  @ApiOkResponse({
    description: "Access token",
    type: String,
  })
  async refresh(
    @Body() body: RefreshTokenRequestDto,
    @I18n() i18n: I18nContext,
  ): Promise<string> {
    return this.authentificationService.refreshToken(body.refreshToken, i18n);
  }

  @Post("logout")
  @ApiOperation({ summary: "Logout" })
  @ApiOkResponse({
    description: "Successful message",
    type: SuccessfulResponseDto,
  })
  async logout(
    @Token() token: string,
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
    @Token() token: string,
    @I18n() i18n: I18nContext,
    @Res() response: Response,
  ): Promise<void> {
    const userId = await this.authentificationService.validateToken(
      token,
      i18n,
    );
    response.setHeader("X-User-ID", userId);
    response.send(userId);
  }
}
