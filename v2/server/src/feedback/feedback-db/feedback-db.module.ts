import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../core/firebase';
import { FeedbackDbService } from './feedback-db.service';

@Module({
  imports: [FirebaseModule],
  providers: [FeedbackDbService],
  exports: [FeedbackDbService],
})
export class FeedbackDbModule {}
