import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {JwtPayloadDto} from './dto/jwt-payload.dto';

@Injectable()
export class JwtService {
    private readonly accessSecret = process.env.JWT_ACCESS_SECRET ?? "";
    private readonly refreshSecret = process.env.JWT_REFRESH_SECRET ?? "";
    private readonly logger = new Logger(JwtService.name);

    generateAccessToken(payload: JwtPayloadDto): string {
        if (!this.accessSecret) {
            this.logger.error(`JWT access secret is not defined`);
            throw new InternalServerErrorException('Authentication error');
        }
        return jwt.sign(payload, this.accessSecret, {expiresIn: '15m'});
    }

    generateRefreshToken(payload: JwtPayloadDto): string {
        if (!this.refreshSecret) {
            this.logger.error(`JWT refresh secret is not defined`);
            throw new InternalServerErrorException('Authentication error');
        }
        return jwt.sign(payload, this.refreshSecret, {expiresIn: '7d'});
    }

    verifyAccessToken(token: string) {
        return jwt.verify(token, this.accessSecret) as JwtPayloadDto;
    }

    verifyRefreshToken(token: string) {
        return jwt.verify(token, this.refreshSecret) as JwtPayloadDto;
    }
}