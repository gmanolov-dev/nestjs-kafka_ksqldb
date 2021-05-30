import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { forwardRef, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { MappersModule } from 'src/mappers/mappers.module';
import { TickerMessageListener } from './amqp/ticker-event-listener/ticker-event-listener';
import { EventTickerSubscribeController } from './http/event-ticker-subscribe/event-ticker-subscribe.controller';
import { TickerEventRepository } from './repositories/ticker-event-repository';

console.log(process.env.AMQP_EXCHANGE);
console.log(process.env.AMQP_TOPIC);
console.log(process.env.RABBITMQ_HOST);
console.log(process.env.NODE_ENV);

const AmqpClientModule = RabbitMQModule.forRoot(RabbitMQModule, {
  exchanges: [
    {
      name: process.env.AMQP_EXCHANGE,
      type: 'topic',
    },
  ],
  uri: `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
  connectionInitOptions: { wait: false },
});

@Module({
  imports: [AmqpClientModule, MappersModule, forwardRef(() => DomainModule)],
  providers: [TickerMessageListener, TickerEventRepository],
  controllers: [EventTickerSubscribeController],
  exports: [TickerEventRepository]
})
export class InfrastructureModule { }
