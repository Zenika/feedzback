import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class UpdateManagerDto {
  @IsEmail() @Transform((params) => (params.value as string).toLowerCase()) managerEmail!: string;
}
