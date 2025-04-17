import {ConflictException, Injectable} from '@nestjs/common';
import {SignupAuthenticationDto} from "./dto/signup-authentication.dto";
import {InjectModel} from '@nestjs/mongoose';
import {User} from "./entities/user.entity";
import {Model} from 'mongoose';
import {JwtService} from '../jwt/jwt.service';
import {SigninAuthenticationDto} from "./dto/signip-authentication.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) {
    }

    async signup(user: SignupAuthenticationDto) {
        await this.checkEmailUnique(user);
        await (new this.userModel(user)).save();
    }

    async signin(user: SigninAuthenticationDto) {
        const existingUser = await this.userModel.findOne({email: user.email});
        if (!existingUser) {
            throw new ConflictException('Email not found');
        }
        const isMatch = existingUser.comparePassword(user.password);
        if (!isMatch) {
            throw new ConflictException('email or password is incorrect');
        }

        const token = this.jwtService.generateToken({
            id: existingUser._id,
            email: existingUser.email,
        });

        return { token, user: {...existingUser.toObject(), password: undefined} };
    }

    private async checkEmailUnique(user: SignupAuthenticationDto) {
        const existingUser = await this.userModel.findOne({email: user.email});
        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }
    }
}
