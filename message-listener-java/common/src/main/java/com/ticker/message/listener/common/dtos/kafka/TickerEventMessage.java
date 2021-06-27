package com.ticker.message.listener.common.dtos.kafka;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ticker.message.listener.common.enums.TickerEventType;
import lombok.Data;

import java.util.Date;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TickerEventMessage {
    private Date time;
    private String pair;
    private Double price;
    private TickerEventType type;
    private Double size;
    private String exchange;
}
