import { Injectable, OnModuleInit } from '@nestjs/common';
import { InfrastructureFacade } from 'src/infrastructure/infrastructure.facade';

@Injectable()
export class CoinbaseCryptoTicker implements OnModuleInit {
  constructor(
    private readonly infrastructureFacade: InfrastructureFacade,
  ) { }

  async onModuleInit() {
    // TODO: probably read it from the env/config
    this.infrastructureFacade.registerService([
      'BTC-USD',
      'BTC-EUR',
      'ETH-USD',
      'ETH-EUR',
    ]);


    this.infrastructureFacade.getFeed().subscribe(data => {
      this.infrastructureFacade.saveEvent(data);
    });

    (await this.infrastructureFacade.getFeedConfig()).subscribe(
      data => {
        this.infrastructureFacade.subscribe(
          Object.keys(data.pairs).filter(key => data.pairs[key])
        );
      }
    );
  }
}
