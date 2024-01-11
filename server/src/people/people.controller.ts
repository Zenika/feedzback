import { Body, Controller, Post } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Post('')
  search(@Body() search: { query: string; accessToken: string }) {
    return this.peopleService.search(search.query, search.accessToken);
  }
}
