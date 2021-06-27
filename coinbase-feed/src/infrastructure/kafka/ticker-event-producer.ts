import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TickerEventMessage } from 'common/dtos/kafka/ticker-event-message';
import { Admin, Kafka, Producer } from 'kafkajs';

@Injectable()
export class TickerEventProducer implements OnModuleInit, OnModuleDestroy {
  producer: Producer;
  

  constructor(
    private readonly configService: ConfigService,
  ) {}
  

  async onModuleInit() {
    const kafka = (new Kafka({
      brokers: this.configService.get("KAFKA_BROKERS").split(","),
    }));
    await this.createTopic(kafka);

    this.producer = kafka.producer();
    
    await this.producer.connect();
  }

  onModuleDestroy() {
    if (this.producer) {
      this.producer.disconnect();
    }
  }

  async send(tickerEventMessage: TickerEventMessage): Promise<void> {
    console.log(`send ${tickerEventMessage.pair}`);
    await this.producer.send({
      topic: this.configService.get("AMQP_TICKER_TOPIC_PRODUCER"),
      messages: [{
        key: `${tickerEventMessage.exchange}-${tickerEventMessage.pair}`,
        value: JSON.stringify({ ...tickerEventMessage }),
      }],
    });
  }

  private async createTopic(kafka: Kafka): Promise<void> {
    const admin: Admin = kafka.admin();
    await admin.connect();
    // true if created, false if exists
    if (!(await admin.listTopics()).includes(this.configService.get("AMQP_TICKER_TOPIC_PRODUCER"))) {
      await admin.createTopics({
        topics: [{
          topic: this.configService.get("AMQP_TICKER_TOPIC_PRODUCER"),
          numPartitions: 1,
          replicationFactor: 1,
        }],
      });
    }
    await admin.disconnect();
  }
}
