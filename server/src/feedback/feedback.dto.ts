import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsString, MaxLength } from 'class-validator';
import { LARGE_MAX_LENGTH, MEDIUM_MAX_LENGTH } from './feedback.config';

export class FeedbackRequestDto {
  @ApiProperty({ description: 'Recipient email' })
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  recipient: string;

  @ApiProperty({ description: 'message' })
  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  message: string;

  @ApiProperty({ description: 'Shared with manager' })
  @IsBoolean()
  shared: boolean;
}

export class GiveRequestedFeedbackDto {
  @ApiProperty({ description: 'Token' })
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  positive: string;

  @ApiProperty()
  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  negative: string;

  @ApiProperty()
  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  comment: string;
}

export class GiveFeedbackDto {
  @ApiProperty()
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  receiverEmail: string;

  @ApiProperty()
  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  positive: string;

  @ApiProperty()
  @IsString()
  @MaxLength(LARGE_MAX_LENGTH)
  negative: string;

  @ApiProperty()
  @IsString()
  @MaxLength(MEDIUM_MAX_LENGTH)
  comment: string;

  @ApiProperty()
  @IsBoolean()
  shared: boolean;
}

export class ManagedFeedbacksDto {
  @ApiProperty()
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  managedEmail: string;
}
