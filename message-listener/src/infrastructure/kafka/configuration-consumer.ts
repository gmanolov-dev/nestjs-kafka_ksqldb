import * as os from "os";
import { Consumer, Kafka } from "kafkajs";
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Observable, ReplaySubject } from "rxjs";
import { ConfigurationEvent } from "src/domain/entities/configuration-event";
import { ConfigurationEventMapper } from "src/mappers/configuration-event-mapper";


@Injectable()
export class ConfigurationConsumer implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  private configurationEventSubject: ReplaySubject<ConfigurationEvent> = new ReplaySubject<ConfigurationEvent>(1);

  constructor(
    private readonly mapper: ConfigurationEventMapper,
    private readonly configService: ConfigService,
  ) { }
  
  
  async onModuleInit() {
    this.consumer = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    })).consumer({
      groupId: "message-listener-" + os.hostname() + "-" + Date.now(),
      allowAutoTopicCreation: false,
    });
    
    await this.consumer.connect();
    
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }

  async getConfigurationEvents(): Promise<Observable<ConfigurationEvent>> {

    if (!this.consumer) {
      setTimeout(() => {this.getConfigurationEvents()}, 1000);
      return this.configurationEventSubject;
    }

    try {
      await this.consumer.subscribe({ topic: this.configService.get("AMQP_FEED_CONFIGURATION_TOPIC"), fromBeginning: true });
    } catch (e) {
      // TODO: Use logger instead
      console.log(`Topic ${this.configService.get("AMQP_FEED_CONFIGURATION_TOPIC")} still not created`);
      setTimeout(() => {this.getConfigurationEvents()}, 1000);
      return this.configurationEventSubject;
    }
    
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.configurationEventSubject.next(this.mapper.fromConfiguratonEventMessage(
          message
        ));
      },
    });

    return this.configurationEventSubject;
  }
}
