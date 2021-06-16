import * as os from "os";
import { Kafka } from "kafkajs";
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TickerEventMessage } from "common/dtos/amqp/ticker-event-message"
import { TickerEventMapper } from 'src/mappers/ticker-event-mapper';
import { TickerEventListener } from 'src/domain/ticker-message-listener';
import { ConfigService } from "@nestjs/config";


@Injectable()
export class TickerMessageListener implements OnModuleInit {


  constructor(
    private readonly mapper: TickerEventMapper,
    private readonly tickerEventListener: TickerEventListener,
    private readonly configService: ConfigService,
  ) { }


  async onModuleInit() {
    const consumer = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    })).consumer({
      groupId: "message-listener-" + os.hostname(),
      allowAutoTopicCreation: true,
    });

    await consumer.connect();
    await consumer.subscribe({ topic: this.configService.get("AMQP_TICKER_TOPIC_CONSUMER"), fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
          this.tickerEventListener.registerEvent(this.mapper.fromTickerEventMessage(
            JSON.parse(message.value.toString())
          ));
      },
  })
  }
}
