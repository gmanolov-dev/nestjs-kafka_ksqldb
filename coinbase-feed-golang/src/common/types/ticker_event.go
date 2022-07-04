package types

type TickerEvent struct {
	Time     string  `json:"time"`
	Pair     string  `json:"pair"`
	Price    float64 `json:"price"`
	Type     string  `json:"type"`
	Size     float64 `json:"size"`
	Exchange string  `json:"exchange"`
}
