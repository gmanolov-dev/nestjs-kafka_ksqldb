import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { CoinbasePro, WebSocketChannelName, WebSocketEvent, WebSocketTickerMessage } from 'coinbase-pro-node';
import { TickerEvent } from 'src/domain/entities/ticker-event';
import { map } from 'rxjs/operators';
import { CoinbaseTickerMapper } from 'src/mappers/coinbase-ticker-mapper';

@Injectable()
export class ConibaseConnector implements OnModuleInit, OnModuleDestroy {
  private feed: ReplaySubject<WebSocketTickerMessage> = new ReplaySubject<WebSocketTickerMessage>(1);;
  client: CoinbasePro;

  constructor(
    private readonly coinbaseTickerMapper: CoinbaseTickerMapper,
  ) {};
  
  onModuleInit() {
    this.client = new CoinbasePro();
    this.client.ws.on(WebSocketEvent.ON_MESSAGE_TICKER, tickerMessage => {
      this.feed.next(tickerMessage);
    });
    this.client.ws.connect();
  }

  onModuleDestroy() {
    this.feed.complete();
    this.client.ws.disconnect();
  }

  getFeed(): Observable<TickerEvent> {
    return this.feed.pipe(
      map(this.coinbaseTickerMapper.fromWebSocketTickerMessage)
    );
  }

  subscribe(product_ids: string[]) {
    console.log("subscribe");
    if (this.client) {
      this.client.ws.unsubscribe(WebSocketChannelName.TICKER);
    }

    const channel = {
      name: WebSocketChannelName.TICKER,
      product_ids,
    };
    this.client.ws.subscribe([channel]);
  }
}
