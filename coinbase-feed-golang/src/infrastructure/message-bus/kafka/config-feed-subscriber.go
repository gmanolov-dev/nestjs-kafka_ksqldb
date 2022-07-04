package kafka

import (
	"encoding/json"

	cKafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaConfigFeedSubscriber struct {
	broker   string
	topic    string
	consumer *cKafka.Consumer
}

func GetConfigFeedSubscriber(broker, topic string) *KafkaConfigFeedSubscriber {
	return &KafkaConfigFeedSubscriber{
		broker: broker,
		topic:  topic,
	}
}

func (configFeedSubscriber *KafkaConfigFeedSubscriber) Subscribe(onMessage func([]string), onError func(error)) {
	if configFeedSubscriber.consumer == nil {
		configFeedSubscriber.createConsumer()
	}

	err := configFeedSubscriber.consumer.SubscribeTopics([]string{configFeedSubscriber.topic}, nil)
	if err != nil {
		onError(err)
	}
	for {
		msg, err := configFeedSubscriber.consumer.ReadMessage(-1)

		if err == nil {

			config := make(map[string]bool)
			errDecode := json.Unmarshal(msg.Value, &config)
			if errDecode == nil {
				pairs := toJsonPairConfig(config)
				if len(pairs) > 0 {
					onMessage(pairs)
				}

			} else {
				onError(errDecode)
			}
		} else {
			onError(err)
		}
	}

}

func toJsonPairConfig(config map[string]bool) []string {

	var result []string

	for key, value := range config {
		if value {
			result = append(result, key)
		}
	}
	return result
}

func (configFeedSubscriber *KafkaConfigFeedSubscriber) createConsumer() error {
	c, err := cKafka.NewConsumer(&cKafka.ConfigMap{
		"bootstrap.servers": configFeedSubscriber.broker,
		"group.id":          "hardcoded-group",
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		return err
	}

	configFeedSubscriber.consumer = c

	return nil
}
