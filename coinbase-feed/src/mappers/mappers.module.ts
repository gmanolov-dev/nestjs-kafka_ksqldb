import { Module } from '@nestjs/common';
import { CoinbaseTickerMapper } from './coinbase-ticker-mapper';

@Module({
  providers: [CoinbaseTickerMapper],
  exports: [CoinbaseTickerMapper],
})
export class MappersModule {}
