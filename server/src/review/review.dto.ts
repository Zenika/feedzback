import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReviewNote } from './review-db/review-db.types';

export class PostReviewDto {
  @IsNumber() @IsIn([1, 3, 5] satisfies ReviewNote[]) note!: ReviewNote;

  @IsOptional() @IsString() comment?: string;
}
