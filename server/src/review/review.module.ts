import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/auth';
import { ReviewDbModule } from './review-db/review-db.module';
import { ReviewController } from './review.controller';

@Module({
  imports: [AuthModule, ReviewDbModule],
  controllers: [ReviewController],
})
export class ReviewModule {}
