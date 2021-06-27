import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TickerEvent } from 'src/domain/entities/ticker-event';
import { CoinbaseTickerMapper } from 'src/mappers/coinbase-ticker-mapper';
import { FeedConfigMessage } from '../../../common/dist/dtos/kafka';
import { ConfigFeedConsumer } from './kafka/config-feed-consumer';
import { RegisterFeedProducer } from './kafka/register-feed-producer';
import { TickerEventProducer } from './kafka/ticker-event-producer';
import { ConibaseConnector } from './connectors/conibase-connector';

@Injectable()
export class InfrastructureFacade {

  constructor(
    private readonly configFeedConsumer: ConfigFeedConsumer,
    private readonly registerFeedProducer: RegisterFeedProducer,
    private readonly conibaseConnector: ConibaseConnector,
    private readonly tickerEventProducer: TickerEventProducer,
    private readonly coinbaseTickerMapper: CoinbaseTickerMapper,
  ) { }

  registerService(availablePairs: string[]): void {
    this.registerFeedProducer.registerFeedService(availablePairs);
  }

  async getFeedConfig(): Promise<Observable<FeedConfigMessage>> {
    return await this.configFeedConsumer.getFeedConfig();
  }

  getFeed(): Observable<TickerEvent> {
    return this.conibaseConnector.getFeed();
  }

  subscribe(product_ids: string[]) {
    this.conibaseConnector.subscribe(product_ids);
  }

  saveEvent(tickerEvent: TickerEvent): void {
    this.tickerEventProducer.send(this.coinbaseTickerMapper.toTickerMessage(tickerEvent));
  }
}
