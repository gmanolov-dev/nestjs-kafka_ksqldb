package com.ticker.message.listener.domain.entities;

import com.ticker.message.listener.common.enums.TickerEventType;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class TickerEvent {
    private Date time;
    private String pair;
    private Double price;
    private TickerEventType type;
    private String exchange;
}
