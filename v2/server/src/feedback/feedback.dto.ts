import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class FeedbackRequestDto {
  @IsEmail() recipient: string;

  @IsString() message: string;

  @IsBoolean() shared: boolean;
}

export class GiveRequestedFeedbackDto {
  @IsString() token: string;

  @IsString() positive: string;

  @IsString() negative: string;

  @IsString() comment: string;
}

export class GiveFeedbackDto {
  @IsEmail() receiverEmail: string;

  @IsString() positive: string;

  @IsString() negative: string;

  @IsString() comment: string;

  @IsBoolean() shared: boolean;
}
