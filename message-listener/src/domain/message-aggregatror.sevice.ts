import { concat, merge, Observable, race, ReplaySubject } from "rxjs";
import { switchMap, map, filter, tap, mergeAll } from "rxjs/operators";
import { MessageEventDto } from "../../../common/dist/dtos/http";
import { ConfigurationEvent } from "./entities/configuration-event";
import { SubscriptionFilter } from "./entities/subscription-filter";
import { TickerEvent } from "./entities/ticker-event";

export class MessageAggregatorSevice {
  private tickerEventSubject: ReplaySubject<TickerEvent> = new ReplaySubject<TickerEvent>(20);
  private configurationEventSubject: ReplaySubject<ConfigurationEvent> = new ReplaySubject<ConfigurationEvent>(10);


  public getAggreagetedMessages(subscriptionFilter: SubscriptionFilter[]): Observable<MessageEventDto> {
    const configurationObservable = this.configurationEventSubject.pipe(
      map((el ) => new MessageEventDto(el.constructor.name.toLowerCase().replace("event", ""), JSON.stringify(el))),
    );

    const tickerObservable = this.tickerEventSubject.pipe(
      filter(el => this.filter(subscriptionFilter, el)),
      map((el ) => new MessageEventDto(el.constructor.name.toLowerCase().replace("event", ""), JSON.stringify(el))),
    )

    return merge(configurationObservable, tickerObservable);
  }


  public addTickerEvent(tickerEvent: TickerEvent) {
    this.tickerEventSubject.next(tickerEvent);
  }

  public addConfigurationEvent(configurationEvent: ConfigurationEvent) {
    this.configurationEventSubject.next(configurationEvent);
  }

  private filter(subscriptionFilter: SubscriptionFilter[], event: TickerEvent): boolean {
    if (!subscriptionFilter) {
      return false;
    }

    const exchange: SubscriptionFilter = subscriptionFilter.find(el => el.exchange === event.exchange) || null;

    if (!exchange) {
      return false;
    }

    if (!exchange.pairs.includes(event.pair)) {
      return false;
    }

    return true;
  }

}