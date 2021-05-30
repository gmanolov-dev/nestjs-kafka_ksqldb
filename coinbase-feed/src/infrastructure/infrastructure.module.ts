import { Module } from '@nestjs/common';
import { CryptoRepository } from './repositories/crypto-repository';
import { ConibaseConnector } from './connectors/conibase-connector';
import { MappersModule } from 'src/mappers/mappers.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { TickerEventSender } from './amqp/ticker-event-sender';

const AmqpClientModule = RabbitMQModule.forRoot(RabbitMQModule, {
  exchanges: [
    {
      name: process.env.AMQP_EXCHANGE,
      type: 'topic',
    },
  ],
  uri: `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
  connectionInitOptions: { wait: false },
  connectionManagerOptions: {
    
  }
});

@Module({
  imports: [
    AmqpClientModule,
    MappersModule
  ],
  providers: [CryptoRepository, ConibaseConnector, TickerEventSender],
  exports: [CryptoRepository],
})
export class InfrastructureModule{}
