package com.ticker.message.listener.infrastructure.http;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticker.message.listener.domain.dtos.SubscriptionFilterDto;
import com.ticker.message.listener.infrastructure.Infrastructure;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subscribe")
@RequiredArgsConstructor
public class MessageListenerController {
    private final Infrastructure infrastructure;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> subscribe(@RequestParam("filter") Optional<String> subscriptionFilterDtos) {
        List<SubscriptionFilterDto> subscriptionFilterDto = new ArrayList<>();
        try {
            subscriptionFilterDto = objectMapper.readValue(
                    URLDecoder.decode(subscriptionFilterDtos.orElse("[]"), Charset.defaultCharset()),
                    new TypeReference<>() {
                    });
        } catch (JsonProcessingException e) {

        }

        return this.infrastructure.getSubscription(subscriptionFilterDto)
                .map(el -> ServerSentEvent.<String>builder()
                        .event(el.getType())
                        .data(el.getData())
                        .build());
    }
}
