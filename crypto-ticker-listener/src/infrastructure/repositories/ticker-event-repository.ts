import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TickerEvent } from '../../domain/entities/ticker-event';
import { SubscriptionFilter } from '../../domain/entities/subscription-filter';

@Injectable()
export class TickerEventRepository {
  private tickerEventSubject: ReplaySubject<TickerEvent> = new ReplaySubject<TickerEvent>(1);

  save(tickerEvent: TickerEvent): void {
    this.tickerEventSubject.next(tickerEvent);
  }

  subscribe(subscriptionFilter: SubscriptionFilter): Observable<TickerEvent> {
    return this.tickerEventSubject.pipe(
      filter((tickerEvent: TickerEvent) => this.filter(subscriptionFilter, tickerEvent))
    );
  }

  private filter(subscriptionFilter: SubscriptionFilter, tickerEvent: TickerEvent): boolean {
    if (!subscriptionFilter) {
      return true;
    }

    if (subscriptionFilter.exchanges
      && subscriptionFilter.exchanges.length
      && !subscriptionFilter.exchanges.includes(tickerEvent.exchange)) {
      return false;
    }

    if (subscriptionFilter.pairs
      && subscriptionFilter.pairs.length
      && !subscriptionFilter.pairs.includes(tickerEvent.pair)
    ) {
      return false;
    }

    return true;
  }
}
