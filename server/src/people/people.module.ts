import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleMiddleware } from './people.middleware';
import { PeopleService } from './people.service';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PeopleMiddleware).forRoutes('people');
  }
}
