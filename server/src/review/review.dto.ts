import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ReviewNote } from './review-db/review-db.types';

export class GiveReviewDto {
  @IsNumber() note!: ReviewNote;

  @IsOptional() @IsString() comment?: string;
}
