import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { TickerEventMessage } from 'common/dtos/amqp/ticker-event-message';

@Injectable()
export class TickerEventSender implements OnModuleInit {

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_TICKER_PRODUCER_CLIENT_ID,
        brokers: process.env.KAFKA_BROKERS.toString().split(","),
      },
      producer: {
        allowAutoTopicCreation: true,
        // TODO: WARN ??? idempotent: true,
      }
    }
  })
  client: ClientKafka;

  constructor(
    private readonly configService: ConfigService,
  ) {}


  async onModuleInit() {
    await this.client.connect();
  }

  async send(tickerEventMessage: TickerEventMessage): Promise<void> {
    console.log("send");
    const res = await this.client.emit(
      this.configService.get("AMQP_TICKER_TOPIC_PRODUCER"),
      {
        key: `${tickerEventMessage.exchange}-${tickerEventMessage.pair}`,
        value: JSON.stringify({ ...tickerEventMessage }),
      }
    );
  }
}
