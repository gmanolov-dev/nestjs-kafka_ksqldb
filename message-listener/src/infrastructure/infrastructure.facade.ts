import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigurationEvent } from 'src/domain/entities/configuration-event';
import { TickerEvent } from 'src/domain/entities/ticker-event';
import { ConfigurationSubscriber } from './amqp/configuration-subscriber';
import { TickerMessageSubscriber } from './amqp/ticker-message-subscriber';

@Injectable()
export class InfrastructureFacade {

  constructor(
    private readonly tickerMessageSubscriber: TickerMessageSubscriber,
    private readonly configurationSubscriber: ConfigurationSubscriber,
  ) { }

  async getTickerEvents(): Promise<Observable<TickerEvent>> {
    return this.tickerMessageSubscriber.getTickerEvents();
  }

  async getConfigurationEvents(): Promise<Observable<ConfigurationEvent>> {
    return await this.configurationSubscriber.getConfigurationEvents();
  }
}
