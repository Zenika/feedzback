import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateManagerDto {
  @ApiProperty()
  @IsEmail()
   managerEmail: string;
}
