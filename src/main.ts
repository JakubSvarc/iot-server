import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import * as cors from 'cors';

import { ServerModule } from './modules/server/server.module';
import { HttpExceptionsFilter } from './modules/api/http.exception.filter';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(ServerModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new HttpExceptionsFilter());
    app.use(cors());
  	await app.listen(3000);
}
bootstrap();
