import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication<any>) => {
  const path = 'swagger';

  const config = new DocumentBuilder()
    .setTitle('FeedZback')
    .setDescription('Request or give feedback to your colleagues')
    .addBearerAuth()
    .addTag('Employee', 'Handle manager')
    .addTag('Feedback', 'Handle request, give, draft and followup related to feedback')
    .addTag('People', 'Search person')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
};
