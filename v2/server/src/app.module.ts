import { Module } from '@nestjs/common';
import { AppConfigModule } from './core/config';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [AppConfigModule, FeedbackModule],
})
export class AppModule {}
