import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from './core/config';
import { ContextMiddleware, ContextModule } from './core/context';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [AppConfigModule, ContextModule, FeedbackModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('');
  }
}
