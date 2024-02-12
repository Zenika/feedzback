import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/auth';
import { ReviewDbService } from './review-db/review-db.service';
import { GiveReviewDto } from './review.dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewDbService: ReviewDbService) {}

  @UseGuards(AuthGuard)
  @Post()
  async setRewiew(@Body() { reviewerEmail, note, comment }: GiveReviewDto) {
    return await this.reviewDbService.setReview({ reviewerEmail, note, comment });
  }
}
