import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from '../auth/auth.middleware';
import { FeedzbackController } from './feedzback.controller';

@Module({
  imports: [AuthModule],
  controllers: [FeedzbackController],
})
export class FeedzbackModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('feedzback');
  }
}
