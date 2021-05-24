import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { CoinbaseCryptoTicker } from './coinbase-crypto-ticker';

@Module({
  imports: [InfrastructureModule],
  providers: [CoinbaseCryptoTicker],
})
export class DomainModule {}
