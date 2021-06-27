import { Admin, Kafka, Consumer } from "kafkajs";
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Observable, ReplaySubject } from "rxjs";
import { FeedConfigMessage } from "common/dtos/kafka"


@Injectable()
export class ConfigFeedConsumer implements OnModuleInit, OnModuleDestroy {
  configFeedSubject: ReplaySubject<FeedConfigMessage> = new ReplaySubject<FeedConfigMessage>(1);
  consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
  ) { }


  async onModuleInit() {
    this.consumer = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    })).consumer(
      {
        groupId: "coinbase-feed" + Math.random(),
        allowAutoTopicCreation: false,
      }
    );

    this.consumer.connect();
  }

  onModuleDestroy() {
    if (this.consumer) {
      this.consumer.disconnect();
    }
  }

  public async getFeedConfig(): Promise<Observable<FeedConfigMessage>> {
    try {
      await this.consumer.subscribe({
        topic: this.configService.get("AMQP_FEED_CONFIGURATION_TOPIC"),
        fromBeginning: true,
      });
    } catch (e) {
      // TODO: use logger
      console.log(`ERROR: Unable to subscribe to topic ${this.configService.get("AMQP_FEED_CONFIGURATION_TOPIC")}`);
      console.log("Try again in 1 second");
      setTimeout(async () => { await this.getFeedConfig() }, 1000);
      return this.configFeedSubject;
    }

    await this.consumer.run({
      eachMessage: async ({topic, partition, message}) => {
        const feedConfigMessage = new FeedConfigMessage(message.key.toString(), JSON.parse(message.value.toString()))
        if (feedConfigMessage.exchange !== `Coinbase Pro`) {
          return;
        }

        this.configFeedSubject.next(new FeedConfigMessage(message.key.toString(), JSON.parse(message.value.toString())));
      }
    });

    return this.configFeedSubject;
  }
}
