package coinbase

import (
	"time"

	types "github.com/common/types"
	ws "github.com/gorilla/websocket"
	coinbasepro "github.com/preichenberger/go-coinbasepro/v2"
)

type CoinbaseFeeder struct {
	wsConn *ws.Conn
	pairs  []string
}

func GetFeeder() *CoinbaseFeeder {
	return &CoinbaseFeeder{}
}

func (feeder *CoinbaseFeeder) SetPairs(pairs []string) *CoinbaseFeeder {
	if feeder.wsConn == nil {
		feeder.connect()
	}

	subscribe := coinbasepro.Message{
		Type: "subscribe",
		Channels: []coinbasepro.MessageChannel{
			{
				Name:       "ticker",
				ProductIds: pairs,
			},
		},
	}
	feeder.pairs = pairs
	feeder.wsConn.WriteJSON(subscribe)

	return feeder
}

func (feeder *CoinbaseFeeder) Subscribe(onEvent func(types.TickerEvent), onError func(error)) {
	if feeder.wsConn == nil {
		feeder.connect()
	}

	for {

		if len(feeder.pairs) == 0 {
			time.Sleep(1 * time.Second)
			continue
		}

		message := coinbasepro.Message{}
		if err := feeder.wsConn.ReadJSON(&message); err != nil {
			onError(err)
			break
		}

		event := toTickerEvent(message)
		if len(event.Pair) > 0 {
			onEvent(event)
		}

	}

}

func (feeder *CoinbaseFeeder) connect() error {
	var wsDialer ws.Dialer
	wsConn, _, err := wsDialer.Dial("wss://ws-feed.pro.coinbase.com", nil)
	if err != nil {
		return err
	}

	feeder.wsConn = wsConn
	return nil
}

func (feeder *CoinbaseFeeder) disconnect() {
	if feeder.wsConn != nil {
		feeder.wsConn.Close()
	}
}
