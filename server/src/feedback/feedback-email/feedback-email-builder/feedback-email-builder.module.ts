import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../../core/config';
import { ContextModule } from '../../../core/context';
import { FeedbackEmailBuilderController } from './feedback-email-builder.controller';
import { FeedbackEmailBuilderService } from './feedback-email-builder.service';

@Module({
  imports: [AppConfigModule, ContextModule],
  providers: [FeedbackEmailBuilderService],
  exports: [FeedbackEmailBuilderService],
  controllers: [FeedbackEmailBuilderController],
})
export class FeedbackEmailBuilderModule {}
