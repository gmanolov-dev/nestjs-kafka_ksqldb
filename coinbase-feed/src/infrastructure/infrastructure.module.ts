import { Module } from '@nestjs/common';
import { ConibaseConnector } from './connectors/conibase-connector';
import { MappersModule } from 'src/mappers/mappers.module';
import { TickerEventSender } from './amqp/ticker-event-sender';
import { RegisterFeedSender } from './amqp/register-feed-sender';
import { ConfigFeedSubscriber } from './amqp/config-feed-subscriber';
import { InfrastructureFacade } from './infrastructure.facade';

@Module({
  imports: [
    MappersModule
  ],
  providers: [ConibaseConnector, TickerEventSender, RegisterFeedSender, ConfigFeedSubscriber, InfrastructureFacade],
  exports: [InfrastructureFacade],
})
export class InfrastructureModule{}
