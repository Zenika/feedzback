import { BadRequestException, Controller, Get, Logger, Query } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}
  private logger = new Logger('PeopleService');

  @Get('search')
  async searchDirectoryPeople(@Query('query') query: string) {
    try {
      return await this.peopleService.searchDirectoryPeople(query);
    } catch (err) {
      this.logger.error(err.message);
      throw new BadRequestException(err.message, err);
    }
  }
}
