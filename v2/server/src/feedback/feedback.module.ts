import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from '../auth/auth.middleware';
import { FirebaseModule } from '../firebase/firebase.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [AuthModule, FirebaseModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('feedback');
  }
}
