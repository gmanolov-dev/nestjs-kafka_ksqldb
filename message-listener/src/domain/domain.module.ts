import { forwardRef, Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { MappersModule } from 'src/mappers/mappers.module';
import { MessageAggregatorSevice } from './message-aggregatror.sevice';
import { TickerEventListener } from './message-listener';

@Module({
  imports: [MappersModule, forwardRef(() => InfrastructureModule)],
  providers: [TickerEventListener, MessageAggregatorSevice],
  exports: [TickerEventListener],
})
export class DomainModule {}
