import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth';
import { AppConfigModule } from '../core/config';
import { GoogleApisService } from '../core/google-apis';
import { PeopleCacheService } from './people.cache.service';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
  imports: [AppConfigModule, AuthModule],
  controllers: [PeopleController],
  providers: [PeopleService, PeopleCacheService, GoogleApisService],
  exports: [PeopleService],
})
export class PeopleModule {}
