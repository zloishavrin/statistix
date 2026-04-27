import { createParamDecorator, ForbiddenException } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";
import { Types } from "mongoose";
import { IAuthRequest } from "../types/auth-request.types";

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Types.ObjectId => {
    const request = ctx.switchToHttp().getRequest<IAuthRequest>();
    const userId = request.headers.userId;

    if (!userId) {
      throw new ForbiddenException();
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ForbiddenException();
    }

    return new Types.ObjectId(userId);
  },
);
