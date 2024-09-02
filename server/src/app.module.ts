import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AssetsModule } from './core/assets';
import { AuthMiddleware, AuthModule } from './core/auth';
import { AppConfigModule } from './core/config';
import { ContextMiddleware, ContextModule } from './core/context';
import { CryptoModule } from './core/crypto/crypto.module';
import { GoogleApisModule } from './core/google-apis';
import { EmployeeModule } from './employee';
import { EmployeeController } from './employee/employee.controller';
import { FeedbackModule } from './feedback';
import { FeedbackController } from './feedback/feedback.controller';
import { HealthModule } from './health';
import { PeopleModule } from './people';
import { PeopleController } from './people/people.controller';
import { VersionModule } from './version';

@Module({
  imports: [
    HealthModule,
    AppConfigModule,
    AssetsModule,
    ContextModule,
    AuthModule,
    CryptoModule,
    GoogleApisModule,
    VersionModule,
    EmployeeModule,
    FeedbackModule,
    PeopleModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('');
    consumer.apply(AuthMiddleware).forRoutes(EmployeeController, FeedbackController, PeopleController);
  }
}
