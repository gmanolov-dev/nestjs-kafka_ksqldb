module cmd

go 1.18

// go 1.18

replace github.com/logging => ../logging

replace github.com/infrastructure/feed => ../infrastructure/feed

replace github.com/infrastructure/message-bus => ../infrastructure/message-bus

replace github.com/common => ../common

require (
	github.com/common v0.0.0-00010101000000-000000000000
	github.com/confluentinc/confluent-kafka-go v1.9.0
	github.com/infrastructure/feed v0.0.0-00010101000000-000000000000
	github.com/infrastructure/message-bus v0.0.0-00010101000000-000000000000
)

require (
	github.com/gorilla/websocket v1.5.0 // indirect
	github.com/joho/godotenv v1.4.0 // indirect
	github.com/logging v0.0.0-00010101000000-000000000000 // indirect
	github.com/preichenberger/go-coinbasepro/v2 v2.1.0 // indirect
)
