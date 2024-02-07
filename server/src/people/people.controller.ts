import { Controller, Get, Param } from '@nestjs/common';
import { PeopleService } from './people.service';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('People')
@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @ApiOperation({
    summary: 'Search a person by a part of his email and fullname',
    description:
      'Search a person by a part of his his email and fullname into a memory copy of the Google user list of the domain.',
  })
  @Get('search/:query')
  searchDirectoryPeople(@Param('query') query: string) {
    return this.peopleService.searchDirectoryPeople(query);
  }
}
