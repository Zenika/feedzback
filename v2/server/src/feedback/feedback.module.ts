import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware, AuthModule } from '../core/auth';
import { EmailModule } from '../core/email/email.module';
import { FirebaseModule } from '../core/firebase';
import { FeedbackDbService } from './feedback-db/feedback-db.service';
import { FeedbackEmailController } from './feedback-email/feedback-email.controller';
import { FeedbackEmailService } from './feedback-email/feedback-email.service';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [AuthModule, FirebaseModule, EmailModule],
  controllers: [FeedbackController, FeedbackEmailController],
  providers: [FeedbackDbService, FeedbackEmailService],
})
export class FeedbackModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('feedback');
  }
}
