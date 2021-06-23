import { forwardRef, Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { Configurator } from './configurator';

@Module({
  imports: [forwardRef(() => InfrastructureModule)],
  providers: [Configurator],
  exports: [Configurator],
})
export class DomainModule {}
