package com.ticker.message.listener.infrastructure.configuration;


import com.ticker.message.listener.common.dtos.kafka.TickerEventMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import reactor.kafka.receiver.ReceiverOptions;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Collections;
import java.util.Map;

@Configuration
public class ReactiveKafkaConsumerConfig {

    @Bean
    public ReceiverOptions<String, TickerEventMessage> kafkaReceiverOptionsTicker(@Value(value = "${EXCHANGE_TICKER_TOPIC}") String topic, KafkaProperties kafkaProperties) {
        String groupId = String.valueOf(Math.random());
        try {
            groupId = InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }


        kafkaProperties.getConsumer().setGroupId(groupId);

        kafkaProperties.getConsumer().getProperties()
                .put("spring.json.value.default.type", "com.ticker.message.listener.common.dtos.kafka.TickerEventMessage");

        ReceiverOptions<String, TickerEventMessage> basicReceiverOptions = ReceiverOptions.create(kafkaProperties.buildConsumerProperties());
        return basicReceiverOptions.subscription(Collections.singletonList(topic));
    }

    @Bean
    public ReactiveKafkaConsumerTemplate<String, TickerEventMessage> reactiveKafkaConsumerTemplateTicker(ReceiverOptions<String, TickerEventMessage> kafkaReceiverOptions) {
        return new ReactiveKafkaConsumerTemplate<String, TickerEventMessage>(kafkaReceiverOptions);
    }


    @Bean
    public ReceiverOptions<String, Map<String, Boolean>> kafkaReceiverOptionsConfig(@Value(value = "${EXCHANGE_CONFIG_TOPIC}") String topic, KafkaProperties kafkaProperties) {
        String groupId = String.valueOf(Math.random());
        try {
            groupId = InetAddress.getLocalHost().getHostName() + "-" + groupId;
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }


        kafkaProperties.getConsumer().setGroupId(groupId);

        kafkaProperties.getConsumer().getProperties()
                .put("spring.json.value.default.type", "java.util.Map");

        ReceiverOptions<String, Map<String, Boolean>> basicReceiverOptions = ReceiverOptions.create(kafkaProperties.buildConsumerProperties());
        return basicReceiverOptions.subscription(Collections.singletonList(topic));
    }

    @Bean
    public ReactiveKafkaConsumerTemplate<String, Map<String, Boolean>> reactiveKafkaConsumerTemplateConfig(ReceiverOptions<String, Map<String, Boolean>> kafkaReceiverOptions) {
        return new ReactiveKafkaConsumerTemplate<String, Map<String, Boolean>>(kafkaReceiverOptions);
    }
}