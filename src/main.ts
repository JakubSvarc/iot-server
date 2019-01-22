import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

import { ServerModule } from './modules/server/server.module';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(ServerModule);

    app.setGlobalPrefix('api/v1');
  	await app.listen(3000);
}
bootstrap();
