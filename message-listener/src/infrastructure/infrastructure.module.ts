import { forwardRef, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { MappersModule } from 'src/mappers/mappers.module';
import { ConfigurationSubscriber } from './amqp/configuration-subscriber';
import { TickerMessageSubscriber } from './amqp/ticker-message-subscriber';
import { EventTickerSubscribeController } from './http/event-ticker-subscribe/event-ticker-subscribe.controller';
import { InfrastructureFacade } from './infrastructure.facade';

@Module({
  imports: [MappersModule, forwardRef(() => DomainModule)],
  providers: [TickerMessageSubscriber, InfrastructureFacade, ConfigurationSubscriber],
  controllers: [EventTickerSubscribeController],
  exports: [InfrastructureFacade]
})
export class InfrastructureModule { }
