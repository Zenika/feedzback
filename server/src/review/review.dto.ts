import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReviewNote } from './review-db/review-db.types';

export class PostReviewDto {
  @IsNumber() @IsIn([1, 2, 3, 4, 5] satisfies ReviewNote[]) note!: ReviewNote;

  @IsOptional() @IsString() comment?: string;
}
