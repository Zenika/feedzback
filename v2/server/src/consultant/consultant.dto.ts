import { IsEmail } from 'class-validator';

export class UpdateManagerDto {
  @IsEmail() managerEmail: string;
}
