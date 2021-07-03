module com.ticker.message.listener.application {
    requires spring.boot.starter.webflux;
    requires spring.boot.autoconfigure;
    requires spring.boot;
    requires spring.beans;
    requires spring.context;


    requires io.netty.transport;
    requires io.netty.common;
    requires reactor.netty.http;


    requires com.ticker.message.listener.common;
    requires com.ticker.message.listener.infrastructure;



    exports com.ticker.message.listener to spring.beans, spring.context;

    opens com.ticker.message.listener to spring.core;
}