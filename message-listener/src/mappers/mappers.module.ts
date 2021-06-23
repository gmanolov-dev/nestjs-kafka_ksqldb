import { Module } from '@nestjs/common';
import { ConfigurationEventMapper } from './configuration-event-mapper';
import { TickerEventMapper } from './ticker-event-mapper';

@Module({
  providers: [TickerEventMapper, ConfigurationEventMapper],
  exports: [TickerEventMapper, ConfigurationEventMapper],
})
export class MappersModule {}
