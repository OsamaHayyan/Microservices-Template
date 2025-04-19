import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "src/jwt/jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            request['user'] = this.jwtService.verifyAccessToken(token);
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        console.log(request.headers)
        const authorizationHeader = request.headers['Authorization'] || request.headers['authorization'];
        const [type, token] = authorizationHeader?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
