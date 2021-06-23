import { Injectable, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SubscriptionFilter } from './entities/subscription-filter';
import { TickerEvent } from './entities/ticker-event';
import { InfrastructureFacade } from 'src/infrastructure/infrastructure.facade';
import { MessageAggregatorSevice } from './message-aggregatror.sevice';
import { MessageEventDto } from '../../../common/dist/dtos/http';

@Injectable()
export class TickerEventListener implements OnModuleInit {
  constructor(
    private readonly infrastructureFacade: InfrastructureFacade,
    private readonly messageAggregatorSevice: MessageAggregatorSevice,
  ) {}
  
  async onModuleInit() {
    (await this.infrastructureFacade.getTickerEvents()).subscribe(
      tickerEvent => this.messageAggregatorSevice.addTickerEvent(tickerEvent)
    );

    (await this.infrastructureFacade.getConfigurationEvents()).subscribe(
      configurationEvent => this.messageAggregatorSevice.addConfigurationEvent(configurationEvent)
    );
  }

  getSubscription(filter: SubscriptionFilter[]): Observable<MessageEventDto> {
    return this.messageAggregatorSevice.getAggreagetedMessages(filter)
  }
}
