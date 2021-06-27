import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigurationEvent } from 'src/domain/entities/configuration-event';
import { TickerEvent } from 'src/domain/entities/ticker-event';
import { ConfigurationConsumer } from './kafka/configuration-consumer';
import { TickerMessageConsumer } from './kafka/ticker-message-consumer';

@Injectable()
export class InfrastructureFacade {

  constructor(
    private readonly tickerMessageConsumer: TickerMessageConsumer,
    private readonly configurationConsumer: ConfigurationConsumer,
  ) { }

  async getTickerEvents(): Promise<Observable<TickerEvent>> {
    return this.tickerMessageConsumer.getTickerEvents();
  }

  async getConfigurationEvents(): Promise<Observable<ConfigurationEvent>> {
    return await this.configurationConsumer.getConfigurationEvents();
  }
}
