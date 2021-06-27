import { forwardRef, Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { MappersModule } from 'src/mappers/mappers.module';
import { ConfigurationConsumer } from './kafka/configuration-consumer';
import { TickerMessageConsumer } from './kafka/ticker-message-consumer';
import { EventTickerSubscribeController } from './http/event-ticker-subscribe/event-ticker-subscribe.controller';
import { InfrastructureFacade } from './infrastructure.facade';

@Module({
  imports: [MappersModule, forwardRef(() => DomainModule)],
  providers: [TickerMessageConsumer, InfrastructureFacade, ConfigurationConsumer],
  controllers: [EventTickerSubscribeController],
  exports: [InfrastructureFacade]
})
export class InfrastructureModule { }
