package com.ticker.message.listener.domain.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticker.message.listener.common.dtos.http.MessageEventDto;
import com.ticker.message.listener.domain.entities.ConfigurationEvent;
import com.ticker.message.listener.domain.entities.TickerEvent;
import org.springframework.stereotype.Component;


@Component
public class MessageMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public MessageEventDto fromTickerEvent(TickerEvent tickerEvent) {
        try {
            return new MessageEventDto("ticker", objectMapper.writeValueAsString(tickerEvent));
        } catch (JsonProcessingException e) {
            return new MessageEventDto("error", "{\"Error\": \"Unable to transform ticker event message\"}");
        }
    }

    public MessageEventDto fromConfigurationEvent(ConfigurationEvent configurationEvent) {
        try {
            return new MessageEventDto("configuration", objectMapper.writeValueAsString(configurationEvent));
        } catch (JsonProcessingException e) {
            return new MessageEventDto("configuration", "{\"Error\": \"Unable to transform ticker event message\"}");
        }
    }
}
