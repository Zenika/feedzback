import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class AskFeedbackDto {
  @IsEmail() recipient: string;

  @IsString() message: string;

  @IsBoolean() shared: boolean;
}

export class SendAskedFeedbackDto {
  @IsString() id: string;

  @IsString() positive: string;

  @IsString() negative: string;

  @IsString() comment: string;
}

export class SendFeedbackDto {
  @IsEmail() receiverEmail: string;

  @IsString() positive: string;

  @IsString() negative: string;

  @IsString() comment: string;

  @IsBoolean() shared: boolean;
}
