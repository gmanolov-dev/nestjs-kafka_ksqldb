package main

import (
	"log"
	"os"

	"github.com/logging"

	"github.com/common/types"
	"github.com/infrastructure/message-bus/kafka"
	"github.com/joho/godotenv"

	coinbase "github.com/infrastructure/feed/coinbase"
)

func onError(err error) {
	println(err.Error())
}

func main() {

	err := godotenv.Load()
	if err != nil {
		logging.Debug(true)
		logging.Log(err.Error())
		log.Fatal("Error loading .env file")
	}

	go kafka.
		GetRegisterFeedSender(
			os.Getenv("KAFKA_BROKERS"),
			os.Getenv("AMQP_AVAILABLE_FEED_SERVICES_TOPIC")).
		Send(
			[]byte("Coinbase Pro"),
			[]byte("[\"BTC-USD\",\"BTC-EUR\",\"ETH-USD\",\"ETH-EUR\"]"))
	messageSender := kafka.GetEventSender(os.Getenv("KAFKA_BROKERS"), os.Getenv("AMQP_TICKER_TOPIC_PRODUCER"))
	configSubscriber := kafka.GetConfigFeedSubscriber(os.Getenv("KAFKA_BROKERS"), os.Getenv("AMQP_FEED_CONFIGURATION_TOPIC"))
	tickerChannel := make(chan types.TickerEvent)
	configChannel := make(chan []string)
	coinbaseFeeder := coinbase.GetFeeder()

	go coinbaseFeeder.Subscribe(initTicker(tickerChannel), onError)
	go configSubscriber.Subscribe(initConfigSubscriber(configChannel), onError)
	for {
		select {
		case tickerEvent := <-tickerChannel:
			messageSender.Send(tickerEvent)
		case pairs := <-configChannel:
			coinbaseFeeder.SetPairs(pairs)
		}

	}
}

func initTicker(tickerChannel chan types.TickerEvent) func(types.TickerEvent) {
	return func(tickerEvent types.TickerEvent) {
		tickerChannel <- tickerEvent
	}
}

func initConfigSubscriber(configChannel chan []string) func([]string) {
	return func(msg []string) {
		configChannel <- msg
	}
}
