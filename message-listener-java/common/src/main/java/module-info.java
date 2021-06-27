module com.ticker.message.listener.common {
    requires static lombok;
    requires com.fasterxml.jackson.databind;

    exports com.ticker.message.listener.common.dtos.kafka;
    exports com.ticker.message.listener.common.dtos.http;
    exports com.ticker.message.listener.common.enums;

    opens com.ticker.message.listener.common.dtos.kafka to com.fasterxml.jackson.databind;
    opens com.ticker.message.listener.common.dtos.http to com.fasterxml.jackson.databind;
    opens com.ticker.message.listener.common.enums to com.fasterxml.jackson.databind;
}