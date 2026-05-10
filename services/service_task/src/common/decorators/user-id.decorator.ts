import { createParamDecorator, ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';
import { Request } from 'express';

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Types.ObjectId => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const rawUserId = request.header('x-user-id');

    if (typeof rawUserId !== 'string') {
      throw new ForbiddenException();
    }

    if (!Types.ObjectId.isValid(rawUserId)) {
      throw new ForbiddenException();
    }

    return new Types.ObjectId(rawUserId);
  },
);
