package com.ticker.message.listener.domain.entities;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Map;

@Data
@Accessors(chain = true)
public class ConfigurationEvent {
    private String exchange;
    private Map<String, Boolean> pairs;
}
