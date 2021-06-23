import { Injectable, OnModuleInit } from '@nestjs/common';
import { InfrastructureFacade } from 'src/infrastructure/infrastructure.facade';
import { ExchangeFeedConfigEntity } from './entities/exchange-feed-config.entity';

@Injectable()
export class Configurator implements OnModuleInit {
  
  constructor(
    private readonly infrastructureFacade: InfrastructureFacade
  ) { }

  async onModuleInit() {
    (await this.infrastructureFacade.getAvailableFeeds()).subscribe(
      exchangeFeedEntity => {
        this.infrastructureFacade.saveExchangeFeedEntity(exchangeFeedEntity);
      }
    );
  }

  async updateExchangeConfig(data: ExchangeFeedConfigEntity[]) {
    this.infrastructureFacade.saveEchangeFeedConfigData(data);
  }
}
