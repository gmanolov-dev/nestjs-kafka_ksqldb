import { Module } from '@nestjs/common';
import { CryptoRepository } from './repositories/crypto-repository';
import { ConibaseConnector } from './connectors/conibase-connector';
import { MappersModule } from 'src/mappers/mappers.module';
import { TickerEventSender } from './amqp/ticker-event-sender';

@Module({
  imports: [
    MappersModule
  ],
  providers: [CryptoRepository, ConibaseConnector, TickerEventSender],
  exports: [CryptoRepository],
})
export class InfrastructureModule{}
