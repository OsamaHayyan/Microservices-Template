import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {JwtModule} from './jwt/jwt.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(`${process.env.MONGODB_URI}`),
        UsersModule,
        JwtModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}