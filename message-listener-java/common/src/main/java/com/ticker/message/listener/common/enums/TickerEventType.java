package com.ticker.message.listener.common.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TickerEventType {
    @JsonProperty("sell")
    SELL,
    @JsonProperty("buy")
    BUY
}
