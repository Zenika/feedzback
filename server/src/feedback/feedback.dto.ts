import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { FeedbackDraftType, FeedbackListType, FeedbackRequestDraftType } from './feedback-db';
import { LARGE_MAX_LENGTH, MEDIUM_MAX_LENGTH, SMALL_MAX_LENGTH } from './feedback.config';

export class FeedbackRequestDto {
  @IsEmail() @Transform((params) => (params.value as string).toLowerCase()) recipient!: string;

  @IsString() @MaxLength(SMALL_MAX_LENGTH) message!: string;

  @IsBoolean() shared!: boolean;
}

export class FeedbackRequestAgainDto {
  @IsString() feedbackId!: string;
}

export class FeedbackArchiveRequestDto {
  @IsString() feedbackId!: string;
}

export class GiveRequestedFeedbackDto {
  @IsString() token!: string;

  @IsString()
  @Transform((params) => (params.value as string)?.trim())
  @IsNotEmpty()
  @MaxLength(LARGE_MAX_LENGTH)
  positive!: string;

  @IsString()
  @Transform((params) => (params.value as string)?.trim())
  @IsNotEmpty()
  @MaxLength(LARGE_MAX_LENGTH)
  negative!: string;

  @IsString()
  @Transform((params) => (params.value as string)?.trim())
  @MaxLength(MEDIUM_MAX_LENGTH)
  comment!: string;
}

export class GiveFeedbackDto {
  @IsEmail() @Transform((params) => (params.value as string).toLowerCase()) receiverEmail!: string;

  @IsString()
  @Transform((params) => (params.value as string)?.trim())
  @IsNotEmpty()
  @MaxLength(LARGE_MAX_LENGTH)
  positive!: string;

  @IsString()
  @Transform((params) => (params.value as string)?.trim())
  @IsNotEmpty()
  @MaxLength(LARGE_MAX_LENGTH)
  negative!: string;

  @IsString()
  @Transform((params) => (params.value as string)?.trim())
  @MaxLength(MEDIUM_MAX_LENGTH)
  comment!: string;

  @IsBoolean() shared!: boolean;
}

export class DeleteFeedbackDraftDto {
  @IsIn([FeedbackDraftType, FeedbackRequestDraftType]) type!: FeedbackDraftType | FeedbackRequestDraftType;

  @IsString() receiverEmailOrToken!: string;
}

export class ArchiveFeedbackDto {
  @IsString() feedbackId!: string;
}

export class FeedbackListMapDto {
  @Transform((params) => (params.value as string).split(','))
  @IsIn(['received', 'given', 'sentRequest', 'receivedRequest'] satisfies FeedbackListType[], { each: true })
  types!: FeedbackListType[];
}

export class SharedFeedbackListDto {
  @IsEmail() @Transform((params) => (params.value as string).toLowerCase()) managedEmail!: string;
}

export class SharedFeedbackDocumentDto {
  @IsString() feedbackId!: string;
}
