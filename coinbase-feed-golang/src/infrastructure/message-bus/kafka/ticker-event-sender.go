package kafka

import (
	"encoding/json"

	"github.com/common/types"
	cKafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaTickerEventSender struct {
	broker   string
	topic    string
	producer *cKafka.Producer
}

func GetEventSender(broker, topic string) *KafkaTickerEventSender {
	return &KafkaTickerEventSender{
		broker: broker,
		topic:  topic,
	}
}

func (tickerEventSender *KafkaTickerEventSender) Send(tickerEvent types.TickerEvent) {
	if tickerEventSender.producer == nil {
		tickerEventSender.createProducer()
	}

	topic := tickerEventSender.topic
	msgValue, _ := json.Marshal(tickerEvent)

	println(tickerEvent.Exchange + "-" + tickerEvent.Pair)
	println(string(msgValue))
	tickerEventSender.producer.Produce(&cKafka.Message{
		TopicPartition: cKafka.TopicPartition{Topic: &topic, Partition: cKafka.PartitionAny},
		Key:            []byte(tickerEvent.Exchange + "-" + tickerEvent.Pair),
		Value:          msgValue,
	}, nil)
}

func (tickerEventSender *KafkaTickerEventSender) createProducer() error {
	p, err := cKafka.NewProducer(&cKafka.ConfigMap{"bootstrap.servers": tickerEventSender.broker})
	if err != nil {
		return err
	}
	tickerEventSender.producer = p
	return nil
}
