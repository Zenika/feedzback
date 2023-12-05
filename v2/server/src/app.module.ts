import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config';
import { FeedbackModule } from './feedback/feedback.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [AppConfigModule, FirebaseModule, AuthModule, FeedbackModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
