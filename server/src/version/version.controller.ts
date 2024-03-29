import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VersionService } from './version.service';

@ApiTags('Version')
@Controller('version')
export class VersionController {
  constructor(private versionService: VersionService) {}

  @Get('')
  get() {
    const { appVersion } = this.versionService;
    return { appVersion };
  }
}
