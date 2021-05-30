import { Controller, Query, Sse } from '@nestjs/common';
import { SubscriptionFilterDto, TickerEventDto } from 'common/dtos/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TickerEventListener as DomainTickerEventListener } from 'src/domain/ticker-message-listener';
import { TickerEventMapper } from 'src/mappers/ticker-event-mapper';

@Controller('/api/subscribe')
export class EventTickerSubscribeController {

  constructor(
    private readonly tickerEventMapper: TickerEventMapper,
    private readonly tickerEventListener: DomainTickerEventListener,
  ) { }

  @Sse()
  getEventsTickerData(@Query('filter') filter?: string): Observable<{type: string, data: TickerEventDto}> {
    // filter: string should be SubscriptionFilterDto

    return this.tickerEventListener
      .getSubscription(
        this.tickerEventMapper.toSubscriptionFilter(filter ? JSON.parse(filter) : null)
      )
      .pipe(
        map(this.tickerEventMapper.toTickerEventDto),
        map(el => ({type: "ticker", data: el}))
      );
  }
}
