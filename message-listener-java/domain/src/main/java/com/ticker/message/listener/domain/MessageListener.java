package com.ticker.message.listener.domain;

import com.ticker.message.listener.common.dtos.http.MessageEventDto;
import com.ticker.message.listener.domain.dtos.SubscriptionFilterDto;
import com.ticker.message.listener.domain.entities.ConfigurationEvent;
import com.ticker.message.listener.domain.entities.TickerEvent;
import com.ticker.message.listener.domain.services.MessageAggregator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageListener {
    private final MessageAggregator messageAggregator;

    public Flux<MessageEventDto> getSubscription(List<SubscriptionFilterDto> subscriptionFilterDto) {
        return this.messageAggregator.getAggregatedMessages(subscriptionFilterDto);
    }

    public void addEvent(TickerEvent tickerEvent) {
        this.messageAggregator.addTickerEvent(tickerEvent);
    }

    public void addEvent(ConfigurationEvent configurationEvent) {
        this.messageAggregator.addConfigurationEvent(configurationEvent);
    }
}
