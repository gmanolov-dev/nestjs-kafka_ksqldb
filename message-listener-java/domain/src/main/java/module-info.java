module com.ticker.message.listener.domain {
    requires static lombok;
    requires spring.context;
    requires reactor.core;
    requires com.fasterxml.jackson.databind;

    requires com.ticker.message.listener.common;

    exports com.ticker.message.listener.domain;
    exports com.ticker.message.listener.domain.dtos;
    exports com.ticker.message.listener.domain.entities;

    exports com.ticker.message.listener.domain.services to spring.beans;
    exports com.ticker.message.listener.domain.mapper to spring.beans;
}