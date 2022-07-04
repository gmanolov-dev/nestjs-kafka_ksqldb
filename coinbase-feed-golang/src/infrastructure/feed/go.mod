module github.com/infrastructure/feed

go 1.18

replace github.com/common => ../../common

require github.com/common v0.0.0-00010101000000-000000000000

require (
	github.com/gorilla/websocket v1.5.0 // indirect
	github.com/joho/godotenv v1.4.0 // indirect
	github.com/preichenberger/go-coinbasepro/v2 v2.1.0 // indirect
)
