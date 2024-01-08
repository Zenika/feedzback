import { Module } from '@nestjs/common';
import { SwaggerService } from './swagger.service';

@Module({
  providers: [SwaggerService]
})
export class SwaggerModule {}
