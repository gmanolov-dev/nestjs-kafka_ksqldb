package coinbase

import (
	"strconv"

	"github.com/common/types"
	"github.com/preichenberger/go-coinbasepro/v2"
)

const (
	layout = "2006-01-02"
)

func toTickerEvent(message coinbasepro.Message) types.TickerEvent {

	price, _ := strconv.ParseFloat(message.Price, 64)
	size, _ := strconv.ParseFloat(message.LastSize, 64)
	layout := "2006-01-02T15:04:05.009Z"

	result := types.TickerEvent{
		Time:     message.Time.Time().Format(layout),
		Pair:     message.ProductID,
		Price:    price,
		Type:     message.Side,
		Size:     size,
		Exchange: "Coinbase Pro",
	}

	return result
}
