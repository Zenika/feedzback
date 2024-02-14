import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/auth';
import { ReviewDbModule } from './review-db/review-db.module';
import { ReviewController } from './review.controller';

@Module({
  imports: [ReviewDbModule, AuthModule],
  controllers: [ReviewController],
})
export class ReviewModule {}