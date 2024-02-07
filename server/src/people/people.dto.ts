import { IsNotEmpty } from 'class-validator';

export class SearchPersonsDto {
  @IsNotEmpty() query!: string;
}
