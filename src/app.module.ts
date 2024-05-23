import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AlphavantageModule } from './alphavantage/alphavantage.module';
import { DealModule } from './deal/deal.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoinbaseModule } from './coinbase/coinbase.module';
import { AppController } from './app/app.controller';

@Module({
  imports: [
    DealModule,
    ProjectModule,
    AlphavantageModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    CoinbaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
