import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: function corsOptionsDelegate(_, corsOptionsCallback) {
      // Note: the function `corsOptionsDelegate` is executed asynchronously so that `configService` is well defined
      const origin = configService.get('clientUrl');
      corsOptionsCallback(null as any, { origin });
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  const configService: ConfigService<AppConfig> = app.get(ConfigService);

  const port = configService.get('serverPort');

  await app.listen(port);
}
bootstrap();
