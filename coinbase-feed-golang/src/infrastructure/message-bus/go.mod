module github.com/infrastructure/message-bus

go 1.18

replace github.com/common => ../../common

require (
	github.com/common v0.0.0-00010101000000-000000000000
	github.com/confluentinc/confluent-kafka-go v1.9.0
)
