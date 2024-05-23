import { Module } from '@nestjs/common';
import { CoinbaseService } from './coinbase.service';
import { CoinbaseController } from './coinbase.controller';
import { HttpModule } from '@nestjs/axios';
import { coinbaseProviders } from './coinbase.providers';

@Module({
  providers: [CoinbaseService, ...coinbaseProviders],
  controllers: [CoinbaseController],
  exports: [CoinbaseService],
  imports: [HttpModule],
})
export class CoinbaseModule {}
