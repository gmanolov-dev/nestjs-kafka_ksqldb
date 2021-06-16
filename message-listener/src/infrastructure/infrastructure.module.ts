import { forwardRef, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { MappersModule } from 'src/mappers/mappers.module';
import { TickerMessageListener } from './amqp/ticker-event-listener/ticker-event-listener';
import { EventTickerSubscribeController } from './http/event-ticker-subscribe/event-ticker-subscribe.controller';
import { TickerEventRepository } from './repositories/ticker-event-repository';

@Module({
  imports: [MappersModule, forwardRef(() => DomainModule)],
  providers: [TickerMessageListener, TickerEventRepository],
  controllers: [EventTickerSubscribeController],
  exports: [TickerEventRepository]
})
export class InfrastructureModule { }
