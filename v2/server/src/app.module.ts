import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config';
import { FeedbackModule } from './feedback/feedback.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [AppConfigModule, FirebaseModule, AuthModule, FeedbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
