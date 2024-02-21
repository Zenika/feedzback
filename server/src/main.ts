import { ValidationPipe } from '@nestjs/common';
import { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';
import { AppModule } from './app.module';
import { AppConfig, AppEnv } from './core/config';
import { setupSwagger } from './core/swagger';

async function bootstrap() {
  // Note:
  //  This function is executed asynchronously so that `configService` is well defined
  // More infos:
  //  - https://docs.nestjs.com/security/cors
  //  - https://github.com/expressjs/cors#configuration-options
  const cors: CorsOptionsDelegate<Request> = (req, corsOptionsCallback) => {
    const origin = configService.get('clientUrl');
    corsOptionsCallback(null as any, { origin, credentials: true });
  };

  const app = await NestFactory.create(AppModule, { cors });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService: ConfigService<AppConfig> = app.get(ConfigService);

  if (configService.get<AppEnv>('appEnv') !== 'production') {
    setupSwagger(app);
  }

  const port = configService.get('serverPort', { infer: true })!;

  await app.listen(port);
}

bootstrap();
