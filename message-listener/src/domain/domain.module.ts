import { forwardRef, Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { MappersModule } from 'src/mappers/mappers.module';
import { TickerEventListener } from './ticker-message-listener';

@Module({
  imports: [MappersModule, forwardRef(() => InfrastructureModule)],
  providers: [TickerEventListener],
  exports: [TickerEventListener],
})
export class DomainModule {}
