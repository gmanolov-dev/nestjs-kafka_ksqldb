import { Injectable } from '@nestjs/common';
import { OrderSide, WebSocketTickerMessage } from 'coinbase-pro-node';
import { TickerEventType } from 'common/common/enums';
import { TickerEventMessage } from 'common/dtos/amqp/ticker-event-message';
import { TickerEvent } from 'src/domain/entities/ticker-event';

@Injectable()
export class CoinbaseTickerMapper {

  fromWebSocketTickerMessage(webSocketTickerMessage: WebSocketTickerMessage): TickerEvent {

    return new TickerEvent({
      pair: webSocketTickerMessage.product_id,
      price: parseFloat(webSocketTickerMessage.price),
      size: parseFloat(webSocketTickerMessage.last_size),
      time: new Date(webSocketTickerMessage.time),
      type: webSocketTickerMessage.side === OrderSide.BUY ? TickerEventType.BUY : TickerEventType.SELL,
    })
  }

  toTickerMessage(tickerEvent: TickerEvent): TickerEventMessage {
    return new TickerEventMessage(
      {
        ...tickerEvent
      }
    )
  }
}
