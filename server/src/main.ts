import { Logger, ValidationPipe } from '@nestjs/common';
import { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const globalPrefix = 'api';

  const app = await NestFactory.create(AppModule, { cors });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('FeedZback')
    .setDescription('FeedZback')
    .setVersion('1.0')
    .addTag('FeedZback')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          /**
           * This value has to be changed with the bearer value
           */
          value: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQxNjg5NDE1ZWMyM2EzMzdlMmJiYWE1ZTNlNjhiNjZkYzk5MzY4ODQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTm9yYmVydCBQT0lOVFUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSjdtVW51TGlzY2ZQdGpwOG1WTHFuM2VRRjYzUV9xWDNwTENUR2FrdXREPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2ZlZWR6YmFjay12Mi1zdGFnaW5nIiwiYXVkIjoiZmVlZHpiYWNrLXYyLXN0YWdpbmciLCJhdXRoX3RpbWUiOjE3MDQzODAxNDYsInVzZXJfaWQiOiJiREhnM3F3STluWlJyNXhHMEVUZ2t6dWpWbGkxIiwic3ViIjoiYkRIZzNxd0k5blpScjV4RzBFVGdrenVqVmxpMSIsImlhdCI6MTcwNDM4MDE0NiwiZXhwIjoxNzA0MzgzNzQ2LCJlbWFpbCI6Im5vcmJlcnQucG9pbnR1QHplbmlrYS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNDU4MDI0MTc5MTA3Njk2OTgyMiJdLCJlbWFpbCI6WyJub3JiZXJ0LnBvaW50dUB6ZW5pa2EuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.Uxb0b_ur3FS3pYq2X_vHqbOec3nC3ajrQTLTnR20s-qa1fK5raFZJ__JyES7jOWtPeuZtHfwWl2_IA0WwUW-tCNadnwNhK3zIwczdlB0iD7ll6i_OlD0_NgHnK1ixDJ11QN5unGX_cSHBnsnnAg4ftPLFZUpsYhWG3mAWm_8ULJ8LsFNMw_IXUjGCYxb47krnv3xvooWqSatbt0b8L2UovGuKolpNRCZEjxcW85Cae27RTQB1W_JKZuipCW0K2nWwHq3Govmv7JbBGaJLfym5-jHFDv1UU6XrotDGTgRbUPR5tsVEMzaSVjEl-3StyI5V2REE_38tHZu3hLJt8FVmg',
        },
      },
    },
  };

  SwaggerModule.setup(globalPrefix, app, document, options);

  const configService: ConfigService<AppConfig> = app.get(ConfigService);

  const port = configService.get('serverPort');

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
