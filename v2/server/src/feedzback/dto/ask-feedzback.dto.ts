import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class AskFeedzbackDto {
  @IsEmail()
  recipient: string;

  @IsString()
  message: string;

  @IsBoolean()
  shared: boolean;
}
