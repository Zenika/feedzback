import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsString, MaxLength } from 'class-validator';
import { FeedbackDraftType, FeedbackRequestedDraftType, FeedbackSpontaneousDraftType } from './feedback-db';
import { LARGE_MAX_LENGTH, MEDIUM_MAX_LENGTH } from './feedback.config';

export class FeedbackRequestDto {
  @IsEmail() @Transform((params) => (params.value as string).toLowerCase()) recipient: string;

  @IsString() @MaxLength(MEDIUM_MAX_LENGTH) message: string;

  @IsBoolean() shared: boolean;
}

export class GiveRequestedFeedbackDto {
  @IsString() token: string;

  @IsString() @MaxLength(LARGE_MAX_LENGTH) positive: string;

  @IsString() @MaxLength(LARGE_MAX_LENGTH) negative: string;

  @IsString() @MaxLength(MEDIUM_MAX_LENGTH) comment: string;
}

export class GiveFeedbackDto {
  @IsEmail() @Transform((params) => (params.value as string).toLowerCase()) receiverEmail: string;

  @IsString() @MaxLength(LARGE_MAX_LENGTH) positive: string;

  @IsString() @MaxLength(LARGE_MAX_LENGTH) negative: string;

  @IsString() @MaxLength(MEDIUM_MAX_LENGTH) comment: string;

  @IsBoolean() shared: boolean;
}

export class DeleteFeedbackDraftDto {
  @IsIn([FeedbackSpontaneousDraftType, FeedbackRequestedDraftType]) type: FeedbackDraftType;

  @IsString() receiverEmailOrToken: string;
}

export class ManagedFeedbacksDto {
  @IsEmail() @Transform((params) => (params.value as string).toLowerCase()) managedEmail: string;
}
