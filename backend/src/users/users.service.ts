import {Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {InjectModel} from '@nestjs/mongoose';
import {User} from "./entities/user.entity";
import {Model, RootFilterQuery, UpdateQuery} from 'mongoose';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        const {email, name, password} = userData;
        const user = new this.userModel({email, name, password});
        try {
            return await user.save();
        } catch (error) {
            this.logger.error('Error creating user', error.stack);
            throw new InternalServerErrorException();
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        try {
            return await this.userModel.findById(userId).lean();
        } catch (e) {
            this.logger.error('Error retrieving user', e);
            throw new NotFoundException('Error retrieving user');
        }
    }

    async getUsers(filter: RootFilterQuery<User>): Promise<User[]> {
        try {
            return await this.userModel.find(filter).lean();
        } catch (error) {
            this.logger.error('Error retrieving users by fields', error.stack);
            throw new InternalServerErrorException('Error retrieving users by fields');
        }
    }

    async getOneUser(filter: RootFilterQuery<User>): Promise<User | null> {
        try {
            return await this.userModel.findOne(filter);
        } catch (error) {
            this.logger.error('Error retrieving users by fields', error.stack);
            throw new InternalServerErrorException('Error retrieving users by fields');
        }
    }

    async isUserExist(filter: RootFilterQuery<User>): Promise<User | null> {
        try {
            return (await this.userModel.exists(filter).lean());
        } catch (error) {
            this.logger.error('Error checking if user exists', error.stack);
            throw new InternalServerErrorException('Error checking if user exists');
        }
    }


    async updateUserById(userId: string, updateData: UpdateQuery<User>): Promise<User | null> {
        try {
            return await this.userModel.findByIdAndUpdate(userId, updateData, {
                new: true,
            }).lean();
        } catch (e) {
            this.logger.error('Error retrieving user', e);
            throw new NotFoundException('Error retrieving user');
        }
    }

    async deleteUser(userId: string): Promise<User | null> {
        try {
            return await this.userModel.findByIdAndDelete(userId).lean();
        } catch (e) {
            this.logger.error('Error deleting user', e);
            throw new InternalServerErrorException('Error deleting user');
        }
    }
}
