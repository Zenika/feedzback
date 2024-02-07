import { Controller, Get, Query, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/auth';
import { SearchPersonsDto } from './people.dto';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @UseGuards(AuthGuard)
  @Get('search')
  searchPersons(@Query() { query }: SearchPersonsDto) {
    try {
      return this.peopleService.searchPersons(query);
    } catch (err) {
      throw new ServiceUnavailableException();
    }
  }
}
