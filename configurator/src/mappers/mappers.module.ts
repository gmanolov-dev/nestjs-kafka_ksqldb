import { Module } from '@nestjs/common';
import { ExchangeFeedMapper } from './exchange-feed.mapper';

@Module({
  providers: [ExchangeFeedMapper],
  exports: [ExchangeFeedMapper]
})
export class MappersModule {}
