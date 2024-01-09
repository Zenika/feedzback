import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('FeedZback')
    .setDescription('Request or give feedback to your colleagues')
    .setVersion('1.0')
    .addTag('FeedZback')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const options: SwaggerCustomOptions = {
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
        },
      },
    },
  };

  SwaggerModule.setup('api', app, document, options);
};
