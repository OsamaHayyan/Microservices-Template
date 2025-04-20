import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {JwtModule} from './jwt/jwt.module';
import {AuthModule} from './auth/auth.module';
import dbConfig from './config/dbConfig';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
        }),
        MongooseModule.forRoot(dbConfig()),
        UsersModule,
        JwtModule,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}