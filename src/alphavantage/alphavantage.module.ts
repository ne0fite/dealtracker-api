import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from './api.service';
import { AlphavantageController } from './alphavantage.controller';

@Module({
  providers: [ApiService],
  exports: [ApiService],
  imports: [HttpModule],
  controllers: [AlphavantageController],
})
export class AlphavantageModule {}
