import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
    imports: [
        ConfigModule.forRoot(),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}