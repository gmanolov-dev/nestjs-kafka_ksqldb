import { Injectable } from '@nestjs/common';
import { TickerEventMessage } from "common/dtos/amqp/ticker-event-message";
import { SubscriptionFilterDto } from 'common/dtos/http';
import { SubscriptionFilter } from 'src/domain/entities/subscription-filter';
import { TickerEvent } from 'src/domain/entities/ticker-event';

@Injectable()
export class TickerEventMapper {
  fromTickerEventMessage(message: TickerEventMessage): TickerEvent {
    return new TickerEvent(
      { ...message }
    )
  };

  toSubscriptionFilter(filter: SubscriptionFilterDto[]): SubscriptionFilter[] {
    if (!filter) {
      return null;
    }
    return filter.map(el => new SubscriptionFilter(el.exchange, el.pairs));
  }
}
