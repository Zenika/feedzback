import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AssetsModule } from './core/assets';
import { AuthMiddleware, AuthModule } from './core/auth';
import { AppConfigModule } from './core/config';
import { ContextMiddleware, ContextModule } from './core/context';
import { CryptoModule } from './core/crypto/crypto.module';
import { GoogleApisModule } from './core/google-apis';
import { EmployeeModule } from './employee';
import { FeedbackModule } from './feedback';
import { HealthModule } from './health';
import { PeopleModule } from './people';

@Module({
  imports: [
    HealthModule,
    AppConfigModule,
    AssetsModule,
    ContextModule,
    AuthModule,
    CryptoModule,
    GoogleApisModule,
    EmployeeModule,
    FeedbackModule,
    PeopleModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('');
    consumer.apply(AuthMiddleware).forRoutes('employee', 'feedback', 'people');
  }
}
