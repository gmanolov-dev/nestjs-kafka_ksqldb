import { Module } from '@nestjs/common';
import { TickerEventMapper } from './ticker-event-mapper';

@Module({
  providers: [TickerEventMapper],
  exports: [TickerEventMapper],
})
export class MappersModule {}
