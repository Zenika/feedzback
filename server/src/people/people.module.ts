import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/auth';
import { AppConfigModule } from 'src/core/config';
import { SearchUsersInMemory } from 'src/core/users-search/users-search-in-cache';
import { SearchUsersWithGoogleApis } from 'src/core/users-search/users-search-with-google-apis.service';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
  imports: [AppConfigModule, AuthModule],
  controllers: [PeopleController],
  providers: [PeopleService, SearchUsersWithGoogleApis, SearchUsersInMemory],
  exports: [PeopleService],
})
export class PeopleModule {}
