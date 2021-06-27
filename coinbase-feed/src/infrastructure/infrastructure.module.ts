import { Module } from '@nestjs/common';
import { ConibaseConnector } from './connectors/conibase-connector';
import { MappersModule } from 'src/mappers/mappers.module';
import { TickerEventProducer } from './kafka/ticker-event-producer';
import { RegisterFeedProducer } from './kafka/register-feed-producer';
import { ConfigFeedConsumer } from './kafka/config-feed-consumer';
import { InfrastructureFacade } from './infrastructure.facade';

@Module({
  imports: [
    MappersModule
  ],
  providers: [ConibaseConnector, TickerEventProducer, RegisterFeedProducer, ConfigFeedConsumer, InfrastructureFacade],
  exports: [InfrastructureFacade],
})
export class InfrastructureModule{}
