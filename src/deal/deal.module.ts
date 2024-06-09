import { Module } from '@nestjs/common';

import { AlphavantageModule } from '../alphavantage/alphavantage.module';
import { DatabaseModule } from '../database/database.module';
import { DealController } from './deal.controller';
import { dealProviders } from './deal.providers';
import { DealService } from './deal.service';
import { MonitorGateway } from './monitor/monitor.gateway';
import { UpdaterService } from './updater.service';
import { CoinbaseModule } from 'src/coinbase/coinbase.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, AlphavantageModule, CoinbaseModule, UserModule],
  controllers: [DealController],
  providers: [DealService, ...dealProviders, UpdaterService, MonitorGateway],
})
export class DealModule {}
