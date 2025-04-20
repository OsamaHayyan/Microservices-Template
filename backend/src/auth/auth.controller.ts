import {Body, Controller, Post, Res,} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginAuthenticationDto} from './dto/login-authentication.dto';
import {Response} from 'express';
import {Cookie} from '../decorators/cookie.decorator';
import {SignupAuthenticationDto} from './dto/signup-authentication.dto';
import {
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {TokenResponseDto} from './dto/token-response.dto';
import {ErrorResponseDto} from './dto/error-response.dto';
import {errorResponse} from "../utils/errorResponse";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/signup')
    @ApiOperation({summary: 'Sign up a new user'})
    @ApiResponse({
        status: 201,
        description: 'User created successfully',
        type: SignupAuthenticationDto,
    })
    @ApiConflictResponse({
        description: 'Email already exists',
        type: ErrorResponseDto,
    })
    async signup(@Body() signupDto: SignupAuthenticationDto) {
        try {
            await this.authService.signup(signupDto);
            return {message: 'User created successfully'};
        } catch (err) {
            throw errorResponse(err)
        }
    }

    @Post('/login')
    @ApiOperation({summary: 'Login user and return tokens'})
    @ApiOkResponse({
        description: 'User logged in successfully',
        type: TokenResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Email not found',
        type: ErrorResponseDto,
    })
    @ApiConflictResponse({
        description: 'Email or password is incorrect',
        type: ErrorResponseDto,
    })
    async login(
        @Body() loginDto: LoginAuthenticationDto,
        @Res({passthrough: true}) res: Response,
    ) {
        try {
            const result = await this.authService.login(loginDto);

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
        } catch (err) {
            throw errorResponse(err)
        }
    }

    @Post('/refresh-token')
    @ApiOperation({summary: 'Refresh access token using refresh token'})
    @ApiOkResponse({
        description: 'Token refreshed successfully',
        type: TokenResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or expired refresh token',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        type: ErrorResponseDto,
    })
    async refreshToken(
        @Cookie('refreshToken') refreshToken: string,
        @Res({passthrough: true}) res: Response,
    ) {
        try {
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
        } catch (err) {
            throw errorResponse(err)
        }
    }

    @Post('/logout')
    @ApiOperation({summary: 'Logout user and clear refresh token'})
    @ApiResponse({status: 200, description: 'Logout successful'})
    @ApiUnauthorizedResponse({
        description: 'Invalid refresh token',
        type: ErrorResponseDto,
    })
    async logout(
        @Cookie('refreshToken') refreshToken: string,
        @Res({passthrough: true}) res: Response,
    ) {
        try {
            await this.authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return {message: 'Logout successful'};
        } catch (err) {
            throw errorResponse(err)
        }
    }
}
