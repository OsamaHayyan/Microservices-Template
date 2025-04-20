import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {JwtModule} from './jwt/jwt.module';
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),
        MongooseModule.forRoot(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongo-primary:27017,mongo-secondary-2:27018,mongo-secondary-3:27019/${process.env.MONGODB_DB}?authSource=admin&replicaSet=rs0`),
        UsersModule,
        JwtModule,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}