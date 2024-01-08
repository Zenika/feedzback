import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GLOBAL_API_PREFIX } from 'src/main';

@Injectable()
export class SwaggerService {
  static addSwaggerToApplication(app: INestApplication<any>) {
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
          },
        },
      },
    };

    SwaggerModule.setup(GLOBAL_API_PREFIX, app, document, options);
  }
}
