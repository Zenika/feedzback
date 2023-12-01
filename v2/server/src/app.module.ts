import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config';
import { FeedzbackModule } from './feedzback/feedzback.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [AppConfigModule, FirebaseModule, AuthModule, FeedzbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
