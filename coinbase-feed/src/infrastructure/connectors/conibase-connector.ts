import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { CoinbasePro, WebSocketChannelName, WebSocketEvent, WebSocketTickerMessage } from 'coinbase-pro-node';

@Injectable()
export class ConibaseConnector {
  private feed: ReplaySubject<WebSocketTickerMessage>;

  getFeed(): Observable<WebSocketTickerMessage> {
    if (this.feed) {
      return this.feed;
    }

    this.feed = new ReplaySubject<WebSocketTickerMessage>(1);
    this.initializeFeed(this.feed);
    return this.feed;
  }

  private initializeFeed(feed: ReplaySubject<WebSocketTickerMessage>) {

    const client = new CoinbasePro();
    // 2. Setup WebSocket channel info
    const channel = {
      name: WebSocketChannelName.TICKER,
      product_ids: [
        'BTC-USD',
        'BTC-EUR',
        'ETH-USD',
        'ETH-EUR',
      ],
    };

    // 3. Wait for open WebSocket to send messages
    client.ws.on(WebSocketEvent.ON_OPEN, () => {
      // 7. Subscribe to WebSocket channel
      client.ws.subscribe([channel]);
    });

    // 4. Listen to WebSocket subscription updates
    client.ws.on(WebSocketEvent.ON_SUBSCRIPTION_UPDATE, subscriptions => {
      // When there are no more subscriptions...
      if (subscriptions.channels.length === 0) {
        // 10. Disconnect WebSocket (and end program)
        client.ws.disconnect();
      }
    });

    // 5. Listen to WebSocket channel updates
    client.ws.on(WebSocketEvent.ON_MESSAGE_TICKER, tickerMessage => {
      feed.next(tickerMessage);
    });

    // 6. Connect to WebSocket
    client.ws.connect();
  }
}
