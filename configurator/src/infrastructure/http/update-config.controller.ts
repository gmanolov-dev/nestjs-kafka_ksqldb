import { Body, Controller, HttpCode, Post, Query, Sse } from '@nestjs/common';
import { FeedConfigDto } from 'common/dtos/http';

import { Configurator } from 'src/domain/configurator';
import { ExchangeFeedMapper } from 'src/mappers/exchange-feed.mapper';

@Controller('/api/feed')
export class UpdateConfigController {

  constructor(
    private readonly mapper: ExchangeFeedMapper,
    private readonly configurator: Configurator,
  ) { }

  @Post()
  @HttpCode(204)
  getMessageEventsData(@Body() data: FeedConfigDto[]): void {

    this.configurator
      .updateExchangeConfig(
        this.mapper.toExchangeFeedConfigEntity(data)
      );
    
    return 
  }
}
