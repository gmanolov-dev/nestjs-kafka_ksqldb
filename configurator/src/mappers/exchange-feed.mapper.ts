import { ExchangeFeedConfigEntity } from "src/domain/entities/exchange-feed-config.entity";
import { ExchangeFeedEntity } from "src/domain/entities/exchange-feed.entity";
import { FeedConfigDto } from "../../../common/dist/dtos/http";

export class ExchangeFeedMapper {

  toExchangeFeedEntiry(raw: {key: string, value: string}): ExchangeFeedEntity {
    return new ExchangeFeedEntity(raw.key, JSON.parse(raw.value));
  }

  toExchangeFeedConfigEntity(data: FeedConfigDto[]): ExchangeFeedConfigEntity[] {
    return data;
  }

  
}