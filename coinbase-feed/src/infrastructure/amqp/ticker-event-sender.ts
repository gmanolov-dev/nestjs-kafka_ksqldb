import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TickerEventMessage } from 'common/dtos/amqp/ticker-event-message';

@Injectable()
export class TickerEventSender {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {}

  async send(TickerEventMessage: TickerEventMessage): Promise<void> {
    this.amqpConnection.publish(
      this.configService.get("AMQP_EXCHANGE"), // exchange
      this.configService.get("AMQP_TOPIC"), // routing key
      {
        ...TickerEventMessage
      }
    );
  }
}
