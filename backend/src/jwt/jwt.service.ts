import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    private readonly secret = process.env.JWT_SECRET;
    private readonly logger = new Logger(JwtService.name);
    generateToken(payload: any): string {
        if (!this.secret) {
            this.logger.error(`JWT secret is not defined`);
            throw new InternalServerErrorException('Sorry, you can try again later');
        }
        return jwt.sign(payload, this.secret ?? "", {expiresIn: '1h'});
    }

}
