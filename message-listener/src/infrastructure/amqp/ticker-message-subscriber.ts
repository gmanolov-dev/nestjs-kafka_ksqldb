import * as os from "os";
import { Consumer, Kafka } from "kafkajs";
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TickerEventMapper } from 'src/mappers/ticker-event-mapper';
import { ConfigService } from "@nestjs/config";
import { Observable, ReplaySubject } from "rxjs";
import { TickerEvent } from "src/domain/entities/ticker-event";


@Injectable()
export class TickerMessageSubscriber implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  private tickerEventSubject: ReplaySubject<TickerEvent> = new ReplaySubject<TickerEvent>(1);

  constructor(
    private readonly mapper: TickerEventMapper,

    private readonly configService: ConfigService,
  ) { }
  
  
  async onModuleInit() {
    this.consumer = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    })).consumer({
      groupId: "message-subscriber-" + os.hostname(),
      allowAutoTopicCreation: false,
    });

    await this.consumer.connect();
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }

  async getTickerEvents(): Promise<Observable<TickerEvent>> {
    if (!this.consumer) {
      setTimeout(() => {this.getTickerEvents()}, 1000);
      return this.tickerEventSubject;
    }

    try {
      await this.consumer.subscribe({ topic: this.configService.get("AMQP_TICKER_TOPIC_CONSUMER"), fromBeginning: true });
    } catch (e) {
      // TODO: Use logger instead
      console.log(`Topic ${this.configService.get("AMQP_TICKER_TOPIC_CONSUMER")} still not created`);
      setTimeout(() => {this.getTickerEvents()}, 1000);
      return this.tickerEventSubject;
    }

    console.log(`Topic ${this.configService.get("AMQP_TICKER_TOPIC_CONSUMER")} start reading`);
   
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.tickerEventSubject.next(this.mapper.fromTickerEventMessage(
          JSON.parse(message.value.toString())
        ));
      },
    });

    return this.tickerEventSubject;
  }
}
