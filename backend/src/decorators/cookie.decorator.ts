import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const Cookie = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const cookies = request.cookies;

        if (!cookies || !cookies[data]) {
            throw new UnauthorizedException('Cookie not found');
        }

        return cookies[data];
    },
);