import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TickerEvent } from 'src/domain/entities/ticker-event';
import { CoinbaseTickerMapper } from 'src/mappers/coinbase-ticker-mapper';
import { TickerEventSender } from '../amqp/ticker-event-sender';
import { ConibaseConnector } from '../connectors/conibase-connector';


@Injectable()
export class CryptoRepository {

  constructor(
    private readonly coinbase: ConibaseConnector,
    private readonly tickerEventSender: TickerEventSender,
    private readonly coinbaseTickerMapper: CoinbaseTickerMapper,
  ) { }

  getFeed(): Observable<TickerEvent> {
    return this.coinbase.getFeed().pipe(
      map(this.coinbaseTickerMapper.fromWebSocketTickerMessage)
    );
  }

  saveEvent(tickerEvent: TickerEvent): void {
    this.tickerEventSender.send(this.coinbaseTickerMapper.toTickerMessage(tickerEvent));
  }

}
