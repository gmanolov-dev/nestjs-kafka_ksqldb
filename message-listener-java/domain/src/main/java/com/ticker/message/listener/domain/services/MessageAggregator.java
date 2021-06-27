package com.ticker.message.listener.domain.services;


import com.ticker.message.listener.common.dtos.http.MessageEventDto;
import com.ticker.message.listener.domain.dtos.SubscriptionFilterDto;
import com.ticker.message.listener.domain.entities.ConfigurationEvent;
import com.ticker.message.listener.domain.entities.TickerEvent;
import com.ticker.message.listener.domain.mapper.MessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageAggregator {
    private final MessageMapper messageMapper;

    private Sinks.Many<TickerEvent> tickerEventSink = Sinks.many().replay().all();
    private Sinks.Many<ConfigurationEvent> configurationEventSink = Sinks.many().replay().all();

    public Flux<MessageEventDto> getAggregatedMessages(List<SubscriptionFilterDto> subscriptionFilterDto) {
        Flux<MessageEventDto> tickerFlux = tickerEventSink.asFlux()
                .filter(el -> this.filter(subscriptionFilterDto, el))
                .map(this.messageMapper::fromTickerEvent);

        Flux<MessageEventDto> configFlux = configurationEventSink.asFlux()
                .map(this.messageMapper::fromConfigurationEvent
                );

        List<Flux<MessageEventDto>> fluxes = new ArrayList<>();
        fluxes.add(tickerFlux);
        fluxes.add(configFlux);

        return Flux.merge(fluxes);
    }

    public void addTickerEvent(TickerEvent tickerEvent) {
        this.tickerEventSink.emitNext(tickerEvent, (signalType, emission) -> false);
    }

    public void addConfigurationEvent(ConfigurationEvent configurationEvent) {
        this.configurationEventSink.emitNext(configurationEvent, (signalType, emission) -> false);
    }

    private boolean filter(List<SubscriptionFilterDto> subscriptionFilterDtos, TickerEvent event) {
        if (subscriptionFilterDtos.size() == 0) {
            return false;
        }

        final SubscriptionFilterDto subscriptionFilterDto = subscriptionFilterDtos.stream()
                .filter(el -> el.getExchange().equals(event.getExchange()))
                .findFirst()
                .orElse(null);

        if (subscriptionFilterDto == null) {
            return false;
        }

        if (!subscriptionFilterDto.getPairs().contains(event.getPair())) {
            return false;
        }

        return true;
    }

}
