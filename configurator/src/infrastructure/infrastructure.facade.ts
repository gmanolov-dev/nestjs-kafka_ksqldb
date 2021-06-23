import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExchangeFeedConfigEntity } from 'src/domain/entities/exchange-feed-config.entity';
import { ExchangeFeedEntity } from 'src/domain/entities/exchange-feed.entity';
import { FeedConfigurationChangeSender } from './amqp/feed-configuration-changed-sender';
import { RegisterFeedSubscriber } from './amqp/register-feed-subscriber';
import { ExchangeEntity } from './datasource/entity/exchange.entity';
import { ExchangeFeedConfigService } from './datasource/exchange-feed-config.service';

@Injectable()
export class InfrastructureFacade {

  constructor(
    private readonly registerFeedSubscriber: RegisterFeedSubscriber,
    private readonly exchangeFeedConfigService: ExchangeFeedConfigService,
    private readonly feedConfigurationChangeSender: FeedConfigurationChangeSender,
  ) { }

  getAvailableFeeds(): Promise<Observable<ExchangeFeedEntity>> {
    return this.registerFeedSubscriber.getAvailableFeeds();
  }

  async saveExchangeFeedEntity(exchangeFeedEntity: ExchangeFeedEntity) {
    const exchangeEntity: ExchangeEntity = await this.exchangeFeedConfigService.updateExchangeEntity(exchangeFeedEntity);
    await this.feedConfigurationChangeSender
      .sendConfigurationChanges({
        key: exchangeEntity.exchange,
        value: JSON.stringify(exchangeEntity.pairs)
      });
  }

  async saveEchangeFeedConfigData(exchangeFeedConfigEntities: ExchangeFeedConfigEntity[]) {
    const exchangeEntity: ExchangeEntity[] = await this.exchangeFeedConfigService.updateMany(exchangeFeedConfigEntities);
    await this.feedConfigurationChangeSender
      .sendConfigurationChangesList(exchangeFeedConfigEntities.map(exchangeEntity => ({
        key: exchangeEntity.exchange,
        value: JSON.stringify(exchangeEntity.pairs)
      })));
  }
}
