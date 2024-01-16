import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AssetsModule } from './core/assets';
import { AuthMiddleware, AuthModule } from './core/auth';
import { AppConfigModule } from './core/config';
import { ContextMiddleware, ContextModule } from './core/context';
import { CryptoModule } from './core/crypto/crypto.module';
import { EmployeeModule } from './employee';
import { FeedbackModule } from './feedback';
import { HealthModule } from './health';
import { PeopleMiddleware } from './people/people.middleware';
import { PeopleModule } from './people/people.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    HealthModule,
    AppConfigModule,
    AssetsModule,
    ContextModule,
    AuthModule,
    CryptoModule,
    FeedbackModule,
    EmployeeModule,
    PeopleModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('');

    // Warning: `AuthMiddleware` and `PeopleMiddleware` are incompatible and cannot be used on the same routes.
    // They both use the `Authorization` header of the request to check the Bearer token,
    // but `AuthMiddleware` expects an `idToken` while `PeopleMiddleware` expects an `accessToken`.
    consumer.apply(AuthMiddleware).forRoutes('feedback', 'employee');
    consumer.apply(PeopleMiddleware).forRoutes('people');
  }
}
