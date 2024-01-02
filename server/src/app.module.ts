import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AssetsModule } from './core/assets';
import { AuthMiddleware, AuthModule } from './core/auth';
import { AppConfigModule } from './core/config';
import { ContextMiddleware, ContextModule } from './core/context';
import { EmployeeModule } from './employee';
import { FeedbackModule } from './feedback';
import { HealthModule } from './health';

@Module({
  imports: [AppConfigModule, AssetsModule, ContextModule, HealthModule, AuthModule, FeedbackModule, EmployeeModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('');
    consumer.apply(AuthMiddleware).forRoutes('');
  }
}
