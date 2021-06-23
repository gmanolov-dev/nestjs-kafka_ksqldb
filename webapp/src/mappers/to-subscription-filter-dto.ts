import { SubscriptionFilterDto } from "common/dtos/http/subscription-filter-dto";
import { SubscriptionFilter } from "../model";

export const toSubscriptionFilterDto = (filter: SubscriptionFilter[]): SubscriptionFilterDto[] => {
  return filter.map(el => new SubscriptionFilterDto(el.exchange, el.pairs));
}