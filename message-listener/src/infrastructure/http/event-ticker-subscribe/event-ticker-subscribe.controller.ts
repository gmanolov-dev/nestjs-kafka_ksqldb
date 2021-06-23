import { Controller, Query, Sse } from '@nestjs/common';
import { MessageEventDto } from 'common/dtos/http';

import { Observable } from 'rxjs';
import { TickerEventListener as DomainTickerEventListener } from 'src/domain/message-listener';
import { TickerEventMapper } from 'src/mappers/ticker-event-mapper';

@Controller('/api/subscribe')
export class EventTickerSubscribeController {

  constructor(
    private readonly tickerEventMapper: TickerEventMapper,
    private readonly tickerEventListener: DomainTickerEventListener,
  ) { }

  @Sse()
  getMessageEventsData(@Query('filter') filter?: string): Observable<MessageEventDto> {
    // filter: string should be SubscriptionFilterDto[]

    return this.tickerEventListener
      .getSubscription(
        this.tickerEventMapper.toSubscriptionFilter(filter ? JSON.parse(filter) : null)
      );
  }
}
