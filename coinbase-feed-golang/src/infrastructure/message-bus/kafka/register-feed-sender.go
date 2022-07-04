package kafka

import (
	cKafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaRegisterFeedSender struct {
	broker   string
	topic    string
	producer *cKafka.Producer
}

func GetRegisterFeedSender(broker, topic string) *KafkaRegisterFeedSender {
	return &KafkaRegisterFeedSender{
		broker: broker,
		topic:  topic,
	}
}

func (registerFeedSender *KafkaRegisterFeedSender) Send(exchange []byte, pairs []byte) {
	if registerFeedSender.producer == nil {
		registerFeedSender.createProducer()
	}

	topic := registerFeedSender.topic

	registerFeedSender.producer.Produce(&cKafka.Message{
		TopicPartition: cKafka.TopicPartition{Topic: &topic, Partition: cKafka.PartitionAny},
		Key:            exchange,
		Value:          pairs,
	}, nil)
}

func (registerFeedSender *KafkaRegisterFeedSender) createProducer() error {
	p, err := cKafka.NewProducer(&cKafka.ConfigMap{"bootstrap.servers": registerFeedSender.broker})
	if err != nil {
		return err
	}
	registerFeedSender.producer = p
	return nil
}
