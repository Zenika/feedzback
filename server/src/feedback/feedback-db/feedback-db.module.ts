import { Module } from '@nestjs/common';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { FirebaseModule } from '../../core/firebase';
import { FeedbackDbService } from './feedback-db.service';

@Module({
  imports: [FirebaseModule, CryptoModule],
  providers: [FeedbackDbService],
  exports: [FeedbackDbService],
})
export class FeedbackDbModule {}
