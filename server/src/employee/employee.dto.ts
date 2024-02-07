import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class UpdateManagerDto {
  @ApiProperty({ description: 'Email of the current user manager' })
  @IsEmail()
  @Transform((params) => (params.value as string).toLowerCase())
  managerEmail: string;
}
