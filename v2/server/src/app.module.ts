import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { FeedzbackModule } from './feedzback/feedzback.module';

@Module({
  imports: [AppConfigModule, FirebaseModule, AuthModule, FeedzbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
