package com.ticker.message.listener.infrastructure.mapper;

import com.ticker.message.listener.common.dtos.kafka.FeedConfigMessage;
import com.ticker.message.listener.common.dtos.kafka.TickerEventMessage;
import com.ticker.message.listener.domain.entities.ConfigurationEvent;
import com.ticker.message.listener.domain.entities.TickerEvent;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DomainMapper {
    public TickerEvent toTickerEvent(final TickerEventMessage tickerEventMessage) {
        return new TickerEvent()
                .setExchange(tickerEventMessage.getExchange())
                .setPair(tickerEventMessage.getPair())
                .setTime(tickerEventMessage.getTime())
                .setPrice(tickerEventMessage.getPrice())
                .setType(tickerEventMessage.getType());
    }

    public ConfigurationEvent toConfigurationEvent(final FeedConfigMessage feedConfigMessage) {
        return new ConfigurationEvent()
                .setExchange(feedConfigMessage.getExchange())
                .setPairs(feedConfigMessage.getPairs().keySet().stream()
                        .collect(Collectors.toMap(el -> el, el -> feedConfigMessage.getPairs().get(el)))
                );
    }
}
