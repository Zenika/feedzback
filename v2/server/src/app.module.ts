import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from './config';
import { AuthMiddleware, AuthModule } from './core/auth';
import { ContextMiddleware, ContextModule } from './core/context';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [AppConfigModule, ContextModule, AuthModule, FeedbackModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('');
    consumer.apply(AuthMiddleware).forRoutes('');
  }
}
