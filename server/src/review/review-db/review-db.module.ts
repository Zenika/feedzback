import { Module } from '@nestjs/common';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { FirebaseModule } from '../../core/firebase';
import { ReviewDbService } from './review-db.service';

@Module({
  imports: [FirebaseModule, CryptoModule],
  providers: [ReviewDbService],
  exports: [ReviewDbService],
})
export class ReviewDbModule {}
