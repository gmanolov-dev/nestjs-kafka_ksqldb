import React, { createContext, MutableRefObject, useCallback, useEffect, useReducer, useRef } from "react";
import { TickerEvent } from "../model";
import { SubscriptionFilterDto } from "common/dtos/http/subscription-filter-dto";
import { addEventListener, setFilter } from "../infrastructure/message-listener";

export const TickerEventContext = createContext<
  {
    tickerEvents: TickerEvent[],
    subscribe?: (filter: SubscriptionFilterDto[]) => void,
    unsubscribe?: () => void,
    selectedFilter: SubscriptionFilterDto[],
  }>({
    tickerEvents: [],
    selectedFilter: [],
  });


type Action = { type: 'change', data: TickerEvent[] } | { type: "setSelectedFilter", data: SubscriptionFilterDto[] };
type State = { tickerEvents: TickerEvent[], selectedFilter:  SubscriptionFilterDto[] };

const reducer = (state: State, action: Action): State => {

  switch (action.type) {
    case "change": {
      const newState: TickerEvent[] = Object.values([...state.tickerEvents, ...action.data].reduce((acc, el) => {
        return { ...acc, [`${el.exchange}-${el.pair}`]: el }
      }, {}));

      return {
        ...state,
        tickerEvents: newState.sort((a, b) => `${a.exchange}-${a.pair}` > `${b.exchange}-${b.pair}` ? 1 : -1),
      }

    }
    case "setSelectedFilter": {
      return {
        ...state,
        tickerEvents: action.data ? state.tickerEvents : [],
        selectedFilter: action.data,
      };
    }
    default:
      return state;
  }
}

export const TickerEventProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { selectedFilter: [], tickerEvents: [] });
  const receivedEventsRef = useRef<TickerEvent[]>([]);
  const unsubscribeRef: MutableRefObject<Function | null> = useRef<Function>(null);

  
  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    dispatch({
      type: "setSelectedFilter",
      data: [],
    });
  }, []);

  const subscribe = useCallback((filter: SubscriptionFilterDto[]): void => {
    unsubscribeRef.current = addEventListener("ticker", (event) => {
      dispatch({
        type: "change",
        data: [JSON.parse((event as MessageEvent).data)],
      });
    });

    setFilter(filter);

    dispatch({
      type: "setSelectedFilter",
      data: filter,
    });
  }, [dispatch]);

  return <TickerEventContext.Provider value={{
    ...state,
    subscribe,
    unsubscribe,

  }}  >
    {children}
  </TickerEventContext.Provider>;
}