import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config';
import { EmailModule } from './email/email.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [AppConfigModule, FirebaseModule, AuthModule, FeedbackModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
