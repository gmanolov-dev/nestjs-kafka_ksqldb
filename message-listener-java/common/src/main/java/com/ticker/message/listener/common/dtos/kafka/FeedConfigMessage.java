package com.ticker.message.listener.common.dtos.kafka;

import lombok.Getter;

import java.util.Map;

@Getter
public class FeedConfigMessage {

    private String exchange;
    private Map<String, Boolean> pairs;

    public FeedConfigMessage(String exchange, Map<String, Boolean> pairs) {
        this.exchange = exchange;
        this.pairs = pairs;
    }
}
