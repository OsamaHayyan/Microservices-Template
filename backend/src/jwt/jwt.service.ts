import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    private readonly accessSecret = process.env.JWT_ACCESS_SECRET ?? "";
    private readonly refreshSecret = process.env.JWT_REFRESH_SECRET ?? "";
    private readonly logger = new Logger(JwtService.name);

    generateAccessToken(payload: any): string {
        if (!this.accessSecret) {
            this.logger.error(`JWT access secret is not defined`);
            throw new InternalServerErrorException('Authentication error');
        }
        return jwt.sign(payload, this.accessSecret, { expiresIn: '15m' });
    }

    generateRefreshToken(payload: any): string {
        if (!this.refreshSecret) {
            this.logger.error(`JWT refresh secret is not defined`);
            throw new InternalServerErrorException('Authentication error');
        }
        return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
    }

    verifyAccessToken(token: string): any {
        return jwt.verify(token, this.accessSecret);
    }

    verifyRefreshToken(token: string): any {
        return jwt.verify(token, this.refreshSecret);
    }
}