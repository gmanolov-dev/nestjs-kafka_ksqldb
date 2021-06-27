package com.ticker.message.listener.infrastructure.kafka;

import com.ticker.message.listener.common.dtos.kafka.TickerEventMessage;
import com.ticker.message.listener.infrastructure.Infrastructure;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import javax.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class TickerMessageConsumer {
    private final Logger log = LoggerFactory.getLogger(TickerMessageConsumer.class);
    private final Infrastructure infrastructure;
    private final ReactiveKafkaConsumerTemplate<String, TickerEventMessage> reactiveKafkaConsumerTemplate;

    @PostConstruct
    public void init() {
        consumeFakeConsumerDTO().subscribe(this.infrastructure::handleMessageReceived);
    }

    private Flux<TickerEventMessage> consumeFakeConsumerDTO() {
        return reactiveKafkaConsumerTemplate
                .receiveAutoAck()
                // .delayElements(Duration.ofSeconds(2L)) // BACKPRESSURE
//                .doOnNext(consumerRecord -> log.info("received key={}, value={} from topic={}, offset={}",
//                        consumerRecord.key(),
//                        consumerRecord.value(),
//                        consumerRecord.topic(),
//                        consumerRecord.offset())
//                )
                .map(ConsumerRecord::value);
//                .doOnNext(tickerEventMessage -> log.info("successfully consumed {}={}", TickerEventMessage.class.getSimpleName(), tickerEventMessage))
//                .doOnError(throwable -> log.error("something bad happened while consuming : {}", throwable.getMessage()));
    }


}
