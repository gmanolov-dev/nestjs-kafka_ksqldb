package com.ticker.message.listener.infrastructure.kafka;

import com.ticker.message.listener.common.dtos.kafka.FeedConfigMessage;
import com.ticker.message.listener.infrastructure.Infrastructure;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import javax.annotation.PostConstruct;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConfigMessageConsumer {
    private final Logger log = LoggerFactory.getLogger(TickerMessageConsumer.class);
    private final Infrastructure infrastructure;
    private final ReactiveKafkaConsumerTemplate<String, Map<String, Boolean>> reactiveKafkaConsumerTemplate;

    @PostConstruct
    public void init() {
        collect().subscribe(
                this.infrastructure::handleMessageReceived
        );
    }

    private Flux<FeedConfigMessage> collect() {
        return reactiveKafkaConsumerTemplate
                .receiveAutoAck()
                // .delayElements(Duration.ofSeconds(2L)) // BACKPRESSURE
//                .doOnNext(consumerRecord -> log.info("received key={}, value={} from topic={}, offset={}",
//                        consumerRecord.key(),
//                        consumerRecord.value(),
//                        consumerRecord.topic(),
//                        consumerRecord.offset())
//                )
                .map(consumerRecord -> new FeedConfigMessage(consumerRecord.key(), consumerRecord.value()));
//                .doOnNext(tickerEventMessage -> log.info("successfully consumed {}={}", TickerEventMessage.class.getSimpleName(), tickerEventMessage))
//                .doOnError(throwable -> log.error("something bad happened while consuming : {}", throwable.getMessage()));
    }


}

