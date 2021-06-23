import { Admin, Kafka } from "kafkajs";
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Producer } from "@nestjs/microservices/external/kafka.interface";


@Injectable()
export class RegisterFeedSender implements OnModuleInit {
  kafka: Kafka;

  constructor(
    private readonly configService: ConfigService,
  ) { }


  async onModuleInit() {
    this.kafka = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    }));

    this.createTopic(this.kafka);
  }

  public async registerFeedService(availablePairs: string[]): Promise<void> {
    const producer: Producer = this.kafka.producer({
      allowAutoTopicCreation: false,
    });

    await producer.connect();
    await producer.send({
      topic: this.configService.get("AMQP_AVAILABLE_FEED_SERVICES_TOPIC"),
      messages: [{
        key: `Coinbase Pro`,
        value: JSON.stringify(availablePairs)
      }],
    });

    await producer.disconnect();
  }

  private async createTopic(kafka: Kafka): Promise<void> {
    const admin: Admin = kafka.admin();
    await admin.connect();
    // true if created, false if exists
    if (!(await admin.listTopics()).includes(this.configService.get("AMQP_AVAILABLE_FEED_SERVICES_TOPIC"))) {
      await admin.createTopics({
        topics: [{
          topic: this.configService.get("AMQP_AVAILABLE_FEED_SERVICES_TOPIC"),
          numPartitions: 1,
          replicationFactor: 1,
          configEntries: [{ name: 'cleanup.policy', value: 'compact' }, { name: 'delete.retention.ms', value: '10' }]
        }],
      })
    }
    await admin.disconnect();
  }
}
