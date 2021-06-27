import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExchangeFeedConfigEntity } from 'src/domain/entities/exchange-feed-config.entity';
import { ExchangeFeedEntity } from 'src/domain/entities/exchange-feed.entity';
import { FeedConfigurationChangeProducer } from './kafka/feed-configuration-changed-producer';
import { RegisterFeedConsumer } from './kafka/register-feed-consumer';
import { ExchangeEntity } from './datasource/entity/exchange.entity';
import { ExchangeFeedConfigService } from './datasource/exchange-feed-config.service';

@Injectable()
export class InfrastructureFacade {

  constructor(
    private readonly registerFeedConsumer: RegisterFeedConsumer,
    private readonly exchangeFeedConfigService: ExchangeFeedConfigService,
    private readonly feedConfigurationChangeProducer: FeedConfigurationChangeProducer,
  ) { }

  getAvailableFeeds(): Promise<Observable<ExchangeFeedEntity>> {
    return this.registerFeedConsumer.getAvailableFeeds();
  }

  async saveExchangeFeedEntity(exchangeFeedEntity: ExchangeFeedEntity) {
    const exchangeEntity: ExchangeEntity = await this.exchangeFeedConfigService.updateExchangeEntity(exchangeFeedEntity);
    await this.feedConfigurationChangeProducer
      .sendConfigurationChanges({
        key: exchangeEntity.exchange,
        value: JSON.stringify(exchangeEntity.pairs)
      });
  }

  async saveEchangeFeedConfigData(exchangeFeedConfigEntities: ExchangeFeedConfigEntity[]) {
    const exchangeEntity: ExchangeEntity[] = await this.exchangeFeedConfigService.updateMany(exchangeFeedConfigEntities);
    await this.feedConfigurationChangeProducer
      .sendConfigurationChangesList(exchangeFeedConfigEntities.map(exchangeEntity => ({
        key: exchangeEntity.exchange,
        value: JSON.stringify(exchangeEntity.pairs)
      })));
  }
}
