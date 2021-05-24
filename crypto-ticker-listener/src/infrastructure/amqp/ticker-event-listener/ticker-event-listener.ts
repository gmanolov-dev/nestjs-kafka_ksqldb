import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { TickerEventMessage } from "common/dtos/amqp/ticker-event-message"
import { TickerEventMapper } from 'src/mappers/ticker-event-mapper';
import { TickerEventListener } from 'src/domain/ticker-message-listener';


@Injectable()
export class TickerMessageListener {

  constructor(
    private readonly mapper: TickerEventMapper,
    private readonly tickerEventListener: TickerEventListener,
  ) {}

  @RabbitSubscribe({
    exchange: process.env.AMQP_EXCHANGE,
    routingKey: process.env.AMQP_TOPIC,
    queueOptions: {
      autoDelete: true,
    }
  })
  public async pubSubHandler(msg: TickerEventMessage) {
    this.tickerEventListener.registerEvent(this.mapper.fromTickerEventMessage(msg));
  }

}
