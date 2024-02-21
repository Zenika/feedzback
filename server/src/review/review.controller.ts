import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthService } from 'src/core/auth';
import { ReviewDbService } from './review-db/review-db.service';
import { PostReviewDto } from './review.dto';

@ApiBearerAuth()
@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(
    private authService: AuthService,
    private reviewDbService: ReviewDbService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async postReview(@Body() { note, comment = '' }: PostReviewDto) {
    const reviewerEmail = this.authService.userEmail!;
    await this.reviewDbService.postReview({ reviewerEmail, note, comment });
  }

  @Get('/stats')
  getStats() {
    return this.reviewDbService.getStats();
  }
}
