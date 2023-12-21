import { ValidationPipe } from '@nestjs/common';
import { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Request } from 'express';
import { AppModule } from './app.module';
import { AppConfig } from './core/config';

async function bootstrap() {
  // Note:
  //  This function is executed asynchronously so that `configService` is well defined
  // More infos:
  //  - https://docs.nestjs.com/security/cors
  //  - https://github.com/expressjs/cors#configuration-options
  const cors: CorsOptionsDelegate<Request> = (req, corsOptionsCallback) => {
    const origin = configService.get('clientUrl');
    corsOptionsCallback(null as any, { origin });
  };

  const app = await NestFactory.create(AppModule, { cors });

  app.useGlobalPipes(new ValidationPipe());

  const configService: ConfigService<AppConfig> = app.get(ConfigService);

  const port = configService.get('serverPort');

  await app.listen(port);
}
bootstrap();
