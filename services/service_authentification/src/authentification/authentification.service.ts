import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { type StringValue } from "ms";
import { I18nContext } from "nestjs-i18n";
import { SuccessfulResponseDto } from "src/common/dtos/successful-response.dto";
import { CryptService } from "src/crypt/crypt.service";

import { ChangePasswordRequestDto } from "./dtos/change-password-request.dto";
import { LoginRequestDto } from "./dtos/login-request.dto";
import { LoginResponseDto } from "./dtos/login-response.dto";
import { RegistrationRequestDto } from "./dtos/registration-request.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
import { Token } from "./models/token.model";
import { User, UserDocument } from "./models/user.model";
import { IJwtPayload } from "./types/jwt-payload.types";
import { AuthentificationMapper } from "./authentification.mapper";

@Injectable()
export class AuthentificationService {
  private isRegistrationEnabled: boolean = false;
  private jwtRefreshExpires: StringValue = "30d";
  private jwtAccessExpires: StringValue = "15m";
  private jwtAccessSecret: string | null = null;
  private jwtRefreshSecret: string | null = null;

  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly authentificationMapper: AuthentificationMapper,
    private readonly cryptService: CryptService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.isRegistrationEnabled =
      this.configService.get<boolean>("registrationEnabled") || false;
    this.jwtAccessSecret =
      this.configService.get<string>("jwt.accessSecret") || "jwt-access";
    this.jwtRefreshSecret =
      this.configService.get<string>("jwt.refreshSecret") || "jwt-refresh";
    this.jwtRefreshExpires =
      this.configService.get<StringValue>("jwt.refreshExpires") || "30d";
    this.jwtAccessExpires =
      this.configService.get<StringValue>("jwt.accessExpires") || "15m";
  }

  /**
   * Registration
   * @param dto Data for create new user
   * @param i18n Localization context
   * @returns Successful message
   */
  async registration(
    dto: RegistrationRequestDto,
    i18n: I18nContext,
  ): Promise<SuccessfulResponseDto> {
    if (!this.isRegistrationEnabled)
      throw new ForbiddenException(
        i18n.service.t("message.registration.forbidden"),
      );
    const loginHmac = this.cryptService.getHmac(dto.login);
    const candidate = await this.userModel.findOne({
      loginHmac: loginHmac,
    });
    if (candidate) {
      throw new BadRequestException(
        i18n.service.t("message.registration.exists"),
      );
    }

    const encryptedLogin = this.cryptService.encryptText(dto.login);

    const passwordHash = await this.cryptService.getPasswordHash(dto.password);

    await this.userModel.create({
      login: encryptedLogin.data,
      loginIV: encryptedLogin.iv,
      loginHmac: loginHmac,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    return {
      message: i18n.service.t("message.registration.successful"),
    };
  }

  /**
   * User login
   * @param dto Data for login
   * @param i18n Localization context
   * @returns Refresh and Access tokens for user
   */
  async login(
    dto: LoginRequestDto,
    i18n: I18nContext,
  ): Promise<LoginResponseDto> {
    if (!this.jwtAccessSecret || !this.jwtRefreshSecret) {
      throw new InternalServerErrorException(
        i18n.service.t("message.server.initialization"),
      );
    }

    const { login, password } = dto;
    const loginHmac = this.cryptService.getHmac(login);
    const user = await this.userModel.findOne({
      loginHmac: loginHmac,
    });
    if (!user)
      throw new NotFoundException(i18n.service.t("message.login.notFindLogin"));
    if (user.isDeleted)
      throw new ForbiddenException(i18n.service.t("message.login.isDeleted"));

    const isPasswordValid = await this.cryptService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new ForbiddenException(
        i18n.service.t("message.login.invalidPassword"),
      );

    const refreshToken = this.jwtService.sign(
      { sub: user._id.toString() },
      {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtRefreshExpires,
      },
    );

    await this.tokenModel.create({
      user: user._id,
      token: refreshToken,
      createdAt: new Date(),
    });

    const accessToken = this.jwtService.sign(
      { sub: user._id.toString() },
      {
        secret: this.jwtAccessSecret,
        expiresIn: this.jwtAccessExpires,
      },
    );

    return {
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

  /** Refresh access token
   * @param token Refresh token
   * @returns Access token
   */
  async refreshToken(token: string, i18n: I18nContext): Promise<string> {
    if (!this.jwtRefreshSecret || !this.jwtAccessSecret) {
      throw new InternalServerErrorException(
        i18n.service.t("message.server.initialization"),
      );
    }

    let payload: IJwtPayload;
    try {
      payload = this.jwtService.verify<IJwtPayload>(token, {
        secret: this.jwtRefreshSecret,
      });
    } catch {
      throw new UnauthorizedException(
        i18n.service.t("message.validate.invalidToken"),
      );
    }

    const tokenDocument = await this.tokenModel.findOne({
      user: new Types.ObjectId(payload.sub),
      token: token,
    });
    if (!tokenDocument) {
      throw new UnauthorizedException(
        i18n.service.t("message.validate.invalidToken"),
      );
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      throw new NotFoundException(i18n.service.t("message.validate.notFound"));
    }

    if (user.isDeleted) {
      throw new ForbiddenException(
        i18n.service.t("message.validate.isDeleted"),
      );
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user._id.toString() },
      {
        secret: this.jwtAccessSecret,
        expiresIn: this.jwtAccessExpires,
      },
    );
    return newAccessToken;
  }

  /** Get information about self by token
   * @param token Access token
   * @param i18n Localization context
   * @returns Information about self
   */
  async getMe(token: string, i18n: I18nContext): Promise<UserResponseDto> {
    const userDocument = await this.getUserByToken(token, i18n);
    return this.authentificationMapper.toUserResponseDto(userDocument);
  }

  /** Change user password
   * @param dto Data for change password
   * @param i18n Localization context
   * @returns Successful message
   */
  async changePassword(
    dto: ChangePasswordRequestDto,
    token: string,
    i18n: I18nContext,
  ): Promise<SuccessfulResponseDto> {
    const { currentPassword, newPassword } = dto;

    const user = await this.getUserByToken(token, i18n);

    if (!user)
      throw new NotFoundException(i18n.service.t("message.login.notFindLogin"));
    if (user.isDeleted)
      throw new ForbiddenException(i18n.service.t("message.login.isDeleted"));

    const isPasswordValid = await this.cryptService.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid)
      throw new ForbiddenException(
        i18n.service.t("message.login.invalidPassword"),
      );

    const newPasswordHash =
      await this.cryptService.getPasswordHash(newPassword);
    user.password = newPasswordHash;
    await user.save();

    await this.tokenModel.deleteMany({
      user: user._id,
      token: {
        $ne: token,
      },
    });

    return {
      message: i18n.service.t("message.changePassword.successful"),
    };
  }

  /**
   * Logout user from all devices
   * @param token Token for logout user
   * @param i18n Localization context
   * @returns Successful message
   */
  async logoutAllDevices(
    token: string | null,
    i18n: I18nContext,
  ): Promise<SuccessfulResponseDto> {
    if (!token)
      throw new UnauthorizedException(
        i18n.service.t("message.validate.invalidToken"),
      );
    const user = await this.getUserByToken(token, i18n);

    await this.tokenModel.deleteMany({
      user: user._id,
    });

    return {
      message: i18n.service.t("message.logout.successful"),
    };
  }

  /**
   * Validate token
   * @param token Access token
   * @param i18n Localization context
   * @returns User ID
   */
  async validateToken(accessToken: string, i18n: I18nContext): Promise<string> {
    if (!this.jwtAccessSecret) {
      throw new InternalServerErrorException(
        i18n.service.t("message.server.initialization"),
      );
    }

    let payload: IJwtPayload;
    try {
      payload = this.jwtService.verify<IJwtPayload>(accessToken, {
        secret: this.jwtAccessSecret,
      });
    } catch {
      throw new UnauthorizedException(
        i18n.service.t("message.validate.invalidToken"),
      );
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user)
      throw new UnauthorizedException(
        i18n.service.t("message.validate.invalidToken"),
      );
    if (user.isDeleted)
      throw new UnauthorizedException(
        i18n.service.t("message.validate.invalidToken"),
      );

    return user._id.toString();
  }

  /**
   * Get user document by token
   * @param token Access token
   */
  private async getUserByToken(
    token: string,
    i18n: I18nContext,
  ): Promise<UserDocument> {
    if (!this.jwtAccessSecret) {
      throw new InternalServerErrorException(
        i18n.service.t("message.server.initialization"),
      );
    }

    let payload: IJwtPayload;
    try {
      payload = this.jwtService.verify<IJwtPayload>(token, {
        secret: this.jwtAccessSecret,
      });
    } catch {
      throw new UnauthorizedException(
        i18n.service.t("message.validate.invalidToken"),
      );
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user)
      throw new NotFoundException(i18n.service.t("message.validate.notFound"));
    if (user.isDeleted)
      throw new ForbiddenException(
        i18n.service.t("message.validate.isDeleted"),
      );

    return user;
  }
}
