import { Controller, Get, Query, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../core/auth';
import { SearchPersonsDto } from './people.dto';
import { PeopleService } from './people.service';

@ApiBearerAuth()
@ApiTags('People')
@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @ApiOperation({ summary: 'Search for people in the Zenika organisation using part of their email or their name' })
  @UseGuards(AuthGuard)
  @Get('search')
  searchPersons(@Query() { query }: SearchPersonsDto) {
    try {
      return this.peopleService.searchPersons(query);
    } catch {
      throw new ServiceUnavailableException();
    }
  }
}
