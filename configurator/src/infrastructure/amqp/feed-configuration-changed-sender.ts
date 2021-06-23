import { Kafka } from "kafkajs";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Producer, Message } from "@nestjs/microservices/external/kafka.interface";

@Injectable()
export class FeedConfigurationChangeSender {

  constructor(
    private readonly configService: ConfigService,
  ) { }

  public async sendConfigurationChanges(msg: Message): Promise<void> {
    const producer: Producer = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    })).producer({
      allowAutoTopicCreation: true,
    });

    await producer.connect();
    await producer.send({
      messages: [msg],
      topic: this.configService.get("AMQP_FEED_CONFIGURATION_TOPIC"),
    })
    await producer.disconnect();
  }

  public async sendConfigurationChangesList(msgs: Message[]): Promise<void> {
    const producer: Producer = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    })).producer({
      allowAutoTopicCreation: true,
    });

    await producer.connect();
    await producer.send({
      messages: msgs,
      topic: this.configService.get("AMQP_FEED_CONFIGURATION_TOPIC"),
    })
    await producer.disconnect();
  }
}
