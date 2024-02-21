import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthService } from 'src/core/auth';
import { ReviewDbService } from './review-db/review-db.service';
import { GiveReviewDto } from './review.dto';

@ApiBearerAuth()
@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(
    private reviewDbService: ReviewDbService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async setRewiew(@Body() { note, comment }: GiveReviewDto) {
    const reviewerEmail = this.authService.userEmail!;

    return await this.reviewDbService.setReview({ reviewerEmail, note, comment });
  }

  @Get('/stats')
  async getStats() {
    return await this.reviewDbService.getStats();
  }
}
