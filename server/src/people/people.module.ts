import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth';
import { AppConfigModule } from '../core/config';
import { GoogleApisModule } from '../core/google-apis';
import { PeopleCacheProvider } from './people-cache.provider';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
  imports: [AppConfigModule, AuthModule, GoogleApisModule],
  providers: [PeopleService, PeopleCacheProvider],
  exports: [PeopleService],
  controllers: [PeopleController],
})
export class PeopleModule {}
