import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReviewNote } from './review-db/review-db.types';

export class GiveReviewDto {
  @IsEmail() reviewerEmail!: string;

  @IsNumber() note!: ReviewNote;

  @IsOptional() @IsString() comment?: string;
}
