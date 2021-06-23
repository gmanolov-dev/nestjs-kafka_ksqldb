import React, { createContext, useCallback, useEffect, useReducer, } from 'react';
import { FeedConfig } from '../model';
import { updateConfig as updateConfigHttpPost } from '../infrastructure/update-config';
import { addEventListener } from '../infrastructure/message-listener';

const exchangesConfig: FeedConfig[] = [];
export const SubscriptionFilterOptionsContext = createContext({ exchangesConfig, updateConfig: (data: FeedConfig[]) => { } });

type Action = { type: 'update', data: FeedConfig[] } | { type: "change", data: FeedConfig };
type State = { exchangesConfig: FeedConfig[] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        exchangesConfig: action.data,
      };
    }
    case 'change': {
      const exchangeConfig = [ ...state.exchangesConfig ];
      const existing = exchangeConfig.find(el => el.exchange === action.data.exchange);
      if (existing) {
        existing.pairs = action.data.pairs;
      } else {
        exchangeConfig.push(action.data);
      }

      return {
        ...state,
        exchangesConfig: [...exchangeConfig],
      };
    }
    default:
      return { ...state };
  }
};


export const SubscriptionFilterOptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { exchangesConfig: exchangesConfig });

  const updateConfig = useCallback(async (data) => {
    dispatch({ type: "update", data });
    await updateConfigHttpPost(data);
  }, [dispatch]);

  useEffect(() => {
    addEventListener("configuration", (event) => {
      dispatch({ type: "change", data: JSON.parse((event as MessageEvent).data) });
    });
  }, [dispatch]);

  return <SubscriptionFilterOptionsContext.Provider value={{ ...state, updateConfig }}>
    {children}
  </SubscriptionFilterOptionsContext.Provider>
}

