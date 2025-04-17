import {Controller, Post, Body} from '@nestjs/common';
import {UsersService} from './users.service';
import {SignupAuthenticationDto} from './dto/signup-authentication.dto';
import {SigninAuthenticationDto} from "./dto/signip-authentication.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post('/signup')
    async signup(@Body() signupAuthenticationDto: SignupAuthenticationDto) {
        await this.usersService.signup(signupAuthenticationDto);
        return "User created successfully";
    }

    @Post('/signin')
    async signin(@Body() signinAuthenticationDto: SigninAuthenticationDto) {
        return await this.usersService.signin(signinAuthenticationDto);
    }
}
