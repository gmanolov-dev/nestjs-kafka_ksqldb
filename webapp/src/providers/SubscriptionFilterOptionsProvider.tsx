import React, { createContext } from 'react';
import { SubscriptionFilter } from '../model';

const subscriptionFilters: SubscriptionFilter = {
  pairs: ['BTC-USD', 'BTC-EUR', 'ETH-USD', 'ETH-EUR'],
  exchanges: ['Coinbase Pro'],
}

export const SubscriptionFilterOptionsContext = createContext(subscriptionFilters);


export const SubscriptionFilterOptionsProvider = ({ children }: { children: React.ReactNode }) => {

  return <SubscriptionFilterOptionsContext.Provider value={subscriptionFilters}>
    {children}
  </SubscriptionFilterOptionsContext.Provider>
}

