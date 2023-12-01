import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from '../auth/auth.middleware';
import { FirebaseModule } from '../firebase/firebase.module';
import { FeedzbackController } from './feedzback.controller';
import { FeedzbackService } from './feedzback.service';

@Module({
  imports: [AuthModule, FirebaseModule],
  controllers: [FeedzbackController],
  providers: [FeedzbackService],
})
export class FeedzbackModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('feedzback');
  }
}
