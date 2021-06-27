package com.ticker.message.listener.common.dtos.http;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MessageEventDto {
    private final String type;
    private final String data;
}
