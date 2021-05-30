import React, { createContext, MutableRefObject, useCallback, useEffect, useReducer, useRef } from "react";
import { TickerEvent } from "../model";
import { SubscriptionFilterDto } from "common/dtos/http/subscription-filter-dto";

export const TickerEventContext = createContext<
  {
    tickerEvents: TickerEvent[],
    subscribe?: (filter: SubscriptionFilterDto) => void,
    unsubscribe?: () => void,
    isSubscribed: boolean,
  }>({
    tickerEvents: [],
    isSubscribed: false,
  });


type Action = { type: 'change', data: TickerEvent[] } | { type: "setIsSubscribed", data: boolean };
type State = { tickerEvents: TickerEvent[], isSubscribed: boolean };

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
    case "setIsSubscribed": {
      return {
        ...state,
        tickerEvents: action.data ? state.tickerEvents : [],
        isSubscribed: action.data,
      };
    }
    default:
      return state;
  }
}

export const TickerEventProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { isSubscribed: false, tickerEvents: [] });
  const receivedEventsRef = useRef<TickerEvent[]>([]);

  const eventsRef: MutableRefObject<EventSource | null> = useRef<EventSource | null>(null);
  const unsubscribe = useCallback(() => {
    if (eventsRef.current !== null) {
      eventsRef.current.close();
      eventsRef.current = null;
    }

    receivedEventsRef.current.length = 0;
    dispatch({
      type: "setIsSubscribed",
      data: false,
    });
  }, []);

  const subscribe = useCallback((filter: SubscriptionFilterDto): void => {
    const sseUriBase = process && process.env && process.env.NODE_ENV === `development` ? `http://localhost:3001` : `/api`;
    eventsRef.current = new EventSource(`${sseUriBase}/subscribe?filter=${JSON.stringify(filter)}`);
    eventsRef.current.onopen = (event) => {
      console.log(event);
    };

    // TODO: change any
    eventsRef.current.addEventListener<any>("ticker", (event: MessageEvent) => {
      receivedEventsRef.current.push(JSON.parse(event.data));
    });

    eventsRef.current.onerror = (event) => {
      console.log(event);

    };

    dispatch({
      type: "setIsSubscribed",
      data: true,
    });
  }, [dispatch]);

  useEffect(() => {
    setInterval(() => {
      if (receivedEventsRef.current.length) {
        dispatch({
          type: "change",
          data: [...receivedEventsRef.current],
        });
        receivedEventsRef.current.length = 0;
      }
    }, 1000);
  }, [dispatch]);


  return <TickerEventContext.Provider value={{
    ...state,
    subscribe,
    unsubscribe,

  }}  >
    {children}
  </TickerEventContext.Provider>;
}