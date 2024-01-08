import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsString, MaxLength } from 'class-validator';
import { LARGE_MAX_LENGTH, MEDIUM_MAX_LENGTH } from './feedback.config';

export class FeedbackRequestDto {
  @ApiProperty({ description: 'Recipient email' })
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  recipient: string;

  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  @ApiProperty({ description: 'message' })
  message: string;

  @IsBoolean()
  @ApiProperty({ description: 'Shared with manager' })
  shared: boolean;
}

export class GiveRequestedFeedbackDto {
  @ApiProperty({ description: 'Token' })
  @IsString()
  token: string;

  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  @ApiProperty()
  positive: string;

  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  @ApiProperty()
  negative: string;

  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  @ApiProperty()
  comment: string;
}

export class GiveFeedbackDto {
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  @ApiProperty()
  receiverEmail: string;

  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  @ApiProperty()
  positive: string;

  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  @ApiProperty()
  negative: string;

  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  @ApiProperty()
  comment: string;

  @IsBoolean() shared: boolean;
}

export class ManagedFeedbacksDto {
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  @ApiProperty()
  managedEmail: string;
}
