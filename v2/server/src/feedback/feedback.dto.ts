import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class AskFeedbackDto {
  @IsEmail()
  recipient: string;

  @IsString()
  message: string;

  @IsBoolean()
  shared: boolean;
}

export type SendFeedbackDto = {
  receiverEmail: string;
  positiveFeedback: string;
  toImprove: string;
  comment: string;
};
