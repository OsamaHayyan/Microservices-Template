import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "../jwt/jwt.service";
import {UsersService} from "../users/users.service";
import {SignupAuthenticationDto} from "./dto/signup-authentication.dto";
import {LoginAuthenticationDto} from "./dto/login-authentication.dto";
import {TokenResponseDto} from './dto/token-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
    }

    async signup(user: SignupAuthenticationDto) {
        const userExist = await this.usersService.getOneUser({email: user.email});
        if (!!userExist) {
            throw new ConflictException('Email already exists');
        }
        await this.usersService.createUser(user);
    }

    async login(user: LoginAuthenticationDto): Promise<TokenResponseDto> {
        const existingUser = await this.usersService.getOneUser({email: user.email});
        if (!existingUser) {
            throw new NotFoundException('Email not found');
        }

        const isMatch = await existingUser.comparePassword(user.password);
        if (!isMatch) {
            throw new ConflictException('Email or password is incorrect');
        }

        const userPayload = {
            id: existingUser._id.toString(),
            email: existingUser.email,
        };


        const accessToken = this.jwtService.generateAccessToken(userPayload);
        const refreshToken = this.jwtService.generateRefreshToken(userPayload);
        await this.usersService.updateUserById(existingUser._id.toString(), {$set: {refreshToken: refreshToken}})

        return {
            accessToken,
            refreshToken,
            user: {
                id: existingUser._id.toString(),
                email: existingUser.email,
                name: existingUser.name,
            }
        };
    }

    async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
        const tokenExists = await this.usersService.isUserExist({refreshToken});
        if (!tokenExists) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const payload = this.jwtService.verifyRefreshToken(refreshToken);

        const user = await this.usersService.getUserById(payload.id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userPayload = {
            id: user._id.toString(),
            email: user.email,
        };

        const newAccessToken = this.jwtService.generateAccessToken(userPayload)
        const newRefreshToken = this.jwtService.generateRefreshToken(userPayload)
        await this.usersService.updateUserById(user._id.toString(), {$set: {refreshToken: newRefreshToken}})

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
            }
        };
    }

    async logout(refreshToken: string) {
        const tokenExists = await this.usersService.isUserExist({refreshToken});
        if (!tokenExists) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        await this.usersService.updateUserById(tokenExists._id.toString(), {$set: {refreshToken: null}})
    }
}
