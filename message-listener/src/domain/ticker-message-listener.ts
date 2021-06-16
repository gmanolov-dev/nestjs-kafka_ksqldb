import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SubscriptionFilter } from './entities/subscription-filter';
import { TickerEvent } from './entities/ticker-event';
import { TickerEventRepository } from '../infrastructure/repositories/ticker-event-repository';

@Injectable()
export class TickerEventListener {
  constructor(
    private readonly tickerEventRepository: TickerEventRepository
  ) {}

  getSubscription(filter: SubscriptionFilter): Observable<TickerEvent> {
    return this.tickerEventRepository.subscribe(filter)
  }


  registerEvent(tickerEvent: TickerEvent) {
    console.log(tickerEvent);
    this.tickerEventRepository.save(tickerEvent);
  }
}
