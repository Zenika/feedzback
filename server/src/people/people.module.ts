import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/core/config';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
  imports: [AppConfigModule],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
