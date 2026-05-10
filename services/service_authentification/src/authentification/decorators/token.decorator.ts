import { createParamDecorator } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";

import type { ExecutionContext } from "@nestjs/common";
import type { IAuthRequest } from "../types/auth-request.types";

export const Token = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<IAuthRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException();
    }

    return token;
  },
);
