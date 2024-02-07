import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsString, MaxLength } from 'class-validator';
import { FeedbackDraftType, FeedbackListType, FeedbackRequestDraftType } from './feedback-db';
import { LARGE_MAX_LENGTH, MEDIUM_MAX_LENGTH } from './feedback.config';
export class FeedbackRequestDto {
  @ApiProperty({ description: 'Recipient email', example: 'john.doe@zenika.com' })
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  recipient: string;

  @ApiProperty({ description: 'message', example: 'Hi John, please give me a feedback on our collaboration.' })
  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  message: string;

  @ApiProperty({ description: 'Shared with manager' })
  @IsBoolean()
  shared: boolean;
}

export class FeedbackRequestAgainDto {
  @ApiProperty({ description: 'Feedback document id' })
  feedbackId: string;
}

export class GiveRequestedFeedbackDto {
  @ApiProperty({ description: 'Give request token' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Positive points comment' })
  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  positive: string;

  @ApiProperty({ description: 'Improvement comment' })
  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  negative: string;

  @ApiProperty({ description: 'Comment' })
  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  comment: string;
}

export class GiveFeedbackDto {
  @ApiProperty({ description: 'Receiver Email' })
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  receiverEmail: string;

  @ApiProperty({ description: 'Positive points comment' })
  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  positive: string;

  @ApiProperty({ description: 'Improvement comment' })
  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  negative: string;

  @ApiProperty({ description: 'Comment' })
  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  comment: string;

  @ApiProperty({ description: 'Share with manager' })
  @IsBoolean()
  shared: boolean;
}

export class DeleteFeedbackDraftDto {
  @ApiProperty({ description: 'Type of draft', enum: ['feedback', 'feedbackRequest'] })
  @IsIn([FeedbackDraftType, FeedbackRequestDraftType])
  type: FeedbackDraftType | FeedbackRequestDraftType;

  @ApiProperty({ description: 'Receiver Email or Token' })
  @IsString()
  receiverEmailOrToken: string;
}

export class FeedbackListMapDto {
  @ApiProperty({ description: 'Type of list', enum: ['received', 'given', 'sentRequest', 'receivedRequest'] })
  @Transform((params) => (params.value as string).split(','))
  @IsIn(['received', 'given', 'sentRequest', 'receivedRequest'] satisfies FeedbackListType[], { each: true })
  types: FeedbackListType[];
}

export class ManagedFeedbacksDto {
  @ApiProperty({ description: 'Managed email' })
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  managedEmail: string;
}
