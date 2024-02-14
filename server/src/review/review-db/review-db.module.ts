import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../core/firebase';
import { ReviewDbService } from './review-db.service';

@Module({
  imports: [FirebaseModule],
  providers: [ReviewDbService],
  exports: [ReviewDbService],
})
export class ReviewDbModule {}
