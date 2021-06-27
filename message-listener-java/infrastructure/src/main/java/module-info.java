module com.ticker.message.listener.infrastructure {
    requires static lombok;

    requires spring.context;
    requires spring.kafka;
    requires spring.boot.autoconfigure;
    requires spring.beans;
    requires spring.web;

    requires reactor.core;
    requires reactor.kafka;

    requires java.annotation;
    requires kafka.clients;
    requires org.slf4j;
    requires com.fasterxml.jackson.databind;

    requires com.ticker.message.listener.common;
    requires com.ticker.message.listener.domain;

    exports com.ticker.message.listener.infrastructure;
    exports com.ticker.message.listener.infrastructure.kafka to spring.beans;
    exports com.ticker.message.listener.infrastructure.configuration to spring.beans, spring.context;
    exports com.ticker.message.listener.infrastructure.http to spring.beans, spring.webflux;
    exports com.ticker.message.listener.infrastructure.mapper to spring.beans;

    opens com.ticker.message.listener.infrastructure to spring.core;
    opens com.ticker.message.listener.infrastructure.kafka to spring.core;
    opens com.ticker.message.listener.infrastructure.http to spring.core;
    opens com.ticker.message.listener.infrastructure.configuration to spring.core;
}