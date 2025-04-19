import {Body, Controller, Post, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginAuthenticationDto} from "./dto/login-authentication.dto";
import {Response} from "express";
import {Cookie} from "../decorators/cookie.decorator";
import {SignupAuthenticationDto} from './dto/signup-authentication.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/signup')
    async signup(@Body() signupAuthenticationDto: SignupAuthenticationDto) {
        await this.authService.signup(signupAuthenticationDto);
        return {message: "User created successfully"};
    }

    @Post('/login')
    async login(
        @Body() loginAuthenticationDto: LoginAuthenticationDto,
        @Res({passthrough: true}) res: Response
    ) {
        const result = await this.authService.login(loginAuthenticationDto);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken: result.accessToken,
            user: result.user,
        };
    }

    @Post('/refresh-token')
    async refreshToken(
        @Cookie('refreshToken') refreshToken: string,
        @Res({passthrough: true}) res: Response
    ) {
        const result = await this.authService.refreshToken(refreshToken);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken: result.accessToken,
            user: result.user,
        };
    }

    @Post('/logout')
    async logout(
        @Cookie('refreshToken') refreshToken: string,
        @Res({passthrough: true}) res: Response
    ) {
        await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return {message: 'Logout successful'};
    }
}
