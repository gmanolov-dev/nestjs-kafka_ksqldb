import { Kafka } from "kafkajs";
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Consumer } from "@nestjs/microservices/external/kafka.interface";

import { Observable, ReplaySubject } from "rxjs";
import { ExchangeFeedEntity } from "src/domain/entities/exchange-feed.entity";
import { ExchangeFeedMapper } from "src/mappers/exchange-feed.mapper";


@Injectable()
export class RegisterFeedSubscriber implements OnModuleInit, OnModuleDestroy {
  private exchangeFeedEntity: ReplaySubject<ExchangeFeedEntity> = new ReplaySubject<ExchangeFeedEntity>(1);
  private consumer: Consumer

  constructor(
    private readonly configService: ConfigService,
    private readonly mapper: ExchangeFeedMapper,
  ) { }

  async onModuleInit() {
    this.consumer = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    })).consumer({
      groupId: "configurator",
      allowAutoTopicCreation: false,
    });
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  public async getAvailableFeeds(): Promise<Observable<ExchangeFeedEntity>> {
    try {
      await this.consumer.subscribe({
        fromBeginning: true,
        topic: this.configService.get("AMQP_AVAILABLE_FEED_SERVICES_TOPIC"),
      });
    } catch (e) {
      // TODO: replace with logger
      console.log("Topic still not available");
      setTimeout(() => { this.getAvailableFeeds() }, 1000);
      return this.exchangeFeedEntity;
    }

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.exchangeFeedEntity.next(
          this.mapper.toExchangeFeedEntiry(
            { 
              key: message.key.toString(),
              value: message.value.toString()
            }
          )
        )
      },
    });

    return this.exchangeFeedEntity;
  }

}
