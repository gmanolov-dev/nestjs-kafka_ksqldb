import { SubscriptionFilterDto } from "../../../common/dist/dtos/http"
import { FeedConfig } from "../model"

export const toConfigPairs = (exchangesConfig: FeedConfig[]) => {
  return exchangesConfig.map(
    el => ({
      exchange: el.exchange,
      pairs: Object.keys(el.pairs)
        .map(pair => ({
          pair: pair,
          checked: el.pairs[pair],
          name: `${el.exchange}-${pair}`,
        }))
    })
  )
}

export const toSubscriptionPairs = (exchangesConfig: FeedConfig[], selectedFilter: SubscriptionFilterDto[]) => {
  return exchangesConfig.map(
    el => ({
      exchange: el.exchange,
      pairs: Object.keys(el.pairs)
        .map(pair => ({
          pair: pair,
          disabled: !el.pairs[pair],
          checked: selectedFilter
            .filter(filter => filter.exchange === el.exchange && filter.pairs.includes(pair))
            .length ? true : false,
          name: `${el.exchange}-${pair}`,
        }))
    })
  )
}
