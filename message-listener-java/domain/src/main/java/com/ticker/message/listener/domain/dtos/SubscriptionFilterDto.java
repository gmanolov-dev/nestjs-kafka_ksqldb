package com.ticker.message.listener.domain.dtos;

import lombok.Data;

import java.util.List;

@Data
public class SubscriptionFilterDto {
    private String exchange;
    private List<String> pairs;
}
