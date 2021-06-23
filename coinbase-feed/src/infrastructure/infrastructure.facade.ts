import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TickerEvent } from 'src/domain/entities/ticker-event';
import { CoinbaseTickerMapper } from 'src/mappers/coinbase-ticker-mapper';
import { FeedConfigMessage } from '../../../common/dist/dtos/amqp';
import { ConfigFeedSubscriber } from './amqp/config-feed-subscriber';
import { RegisterFeedSender } from './amqp/register-feed-sender';
import { TickerEventSender } from './amqp/ticker-event-sender';
import { ConibaseConnector } from './connectors/conibase-connector';

@Injectable()
export class InfrastructureFacade {

  constructor(
    private readonly configFeedSubscriber: ConfigFeedSubscriber,
    private readonly registerFeedSender: RegisterFeedSender,
    private readonly conibaseConnector: ConibaseConnector,
    private readonly tickerEventSender: TickerEventSender,
    private readonly coinbaseTickerMapper: CoinbaseTickerMapper,
  ) { }

  registerService(availablePairs: string[]): void {
    this.registerFeedSender.registerFeedService(availablePairs);
  }

  async getFeedConfig(): Promise<Observable<FeedConfigMessage>> {
    return await this.configFeedSubscriber.getFeedConfig();
  }

  getFeed(): Observable<TickerEvent> {
    return this.conibaseConnector.getFeed();
  }

  subscribe(product_ids: string[]) {
    this.conibaseConnector.subscribe(product_ids);
  }

  saveEvent(tickerEvent: TickerEvent): void {
    this.tickerEventSender.send(this.coinbaseTickerMapper.toTickerMessage(tickerEvent));
  }
}
