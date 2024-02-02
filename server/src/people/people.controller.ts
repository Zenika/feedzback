import { Controller, Get, Param } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Get('search/:query')
  searchDirectoryPeople(@Param('query') query: string) {
    return this.peopleService.searchDirectoryPeople(query);
  }

  @Get('jwt')
  testjwt() {
    return this.peopleService.testWithJWT();
  }

}
