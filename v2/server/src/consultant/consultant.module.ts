import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth';
import { ConsultantDbModule } from './consultant-db';
import { ConsultantController } from './consultant.controller';

@Module({
  imports: [AuthModule, ConsultantDbModule],
  controllers: [ConsultantController],
})
export class ConsultantModule {}
