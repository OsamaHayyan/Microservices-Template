import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder().setTitle('Microservices Template API').setDescription('API documentation for Microservices Template').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();