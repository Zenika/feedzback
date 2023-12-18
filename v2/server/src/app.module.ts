import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConsultantModule } from './consultant';
import { AssetsModule } from './core/assets';
import { AuthMiddleware, AuthModule } from './core/auth';
import { AppConfigModule } from './core/config';
import { ContextMiddleware, ContextModule } from './core/context';
import { FeedbackModule } from './feedback';

@Module({
  imports: [AppConfigModule, AssetsModule, ContextModule, AuthModule, FeedbackModule, ConsultantModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('');
    consumer.apply(AuthMiddleware).forRoutes('');
  }
}
