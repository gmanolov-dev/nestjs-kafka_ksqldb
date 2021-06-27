package com.ticker.message.listener.infrastructure;

import com.ticker.message.listener.common.dtos.http.MessageEventDto;
import com.ticker.message.listener.common.dtos.kafka.FeedConfigMessage;
import com.ticker.message.listener.common.dtos.kafka.TickerEventMessage;
import com.ticker.message.listener.domain.MessageListener;
import com.ticker.message.listener.domain.dtos.SubscriptionFilterDto;
import com.ticker.message.listener.infrastructure.mapper.DomainMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;


@Service
@RequiredArgsConstructor
public class Infrastructure {
    private final MessageListener messageListener;
    private final DomainMapper domainMapper;

    public void handleMessageReceived(FeedConfigMessage msg) {
        this.messageListener.addEvent(this.domainMapper.toConfigurationEvent(msg));
    }

    public void handleMessageReceived(TickerEventMessage msg) {
        this.messageListener.addEvent(this.domainMapper.toTickerEvent(msg));
    }

    public Flux<MessageEventDto> getSubscription(List<SubscriptionFilterDto> subscriptionFilterDtos) {
        return this.messageListener.getSubscription(subscriptionFilterDtos);
    }
}
