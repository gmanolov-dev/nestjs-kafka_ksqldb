import React, { ChangeEvent, useContext, useState } from 'react';

import { 
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
  Divider,
 } from '@material-ui/core';

import { TickerEventContext } from '../../providers/TickerEventProvider';
import { SubscriptionFilterOptionsContext } from '../../providers/SubscriptionFilterOptionsProvider';
import { SubscriptionFilter } from '../../model';

export const SubscriptionChooser = () => {
  const tickerEventContext = useContext(TickerEventContext);
  const subscriptionFilterOptionsContext = useContext(SubscriptionFilterOptionsContext);

  const [selectedPairs, setSelectedPairs] = useState<{ pair: string, checked: boolean }[]>(
    (subscriptionFilterOptionsContext.pairs || []).map(el => ({ pair: el, checked: true }))
  );

  const [selectedExcanges, setSelectedExcanges] = useState<{ exchange: string, checked: boolean }[]>(
    (subscriptionFilterOptionsContext.exchanges || []).map(el => ({ exchange: el, checked: true }))
  );

  const handlePairChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPairs = [...selectedPairs];

    const modified = newPairs.find(el => el.pair === event.target.name);
    if (modified) {
      modified.checked = event.target.checked;
    }
    setSelectedPairs(newPairs);
  };

  const handleExchangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newExchanges = [...selectedExcanges];

    const modified = newExchanges.find(el => el.exchange === event.target.name);
    if (modified) {
      modified.checked = event.target.checked;
    }
    setSelectedExcanges(newExchanges);
  };

  const handleSubscribe = () => {
    if (tickerEventContext.isSubscribed && tickerEventContext.unsubscribe) {
      tickerEventContext.unsubscribe();
      return;
    }

    const subscriptionFilter: SubscriptionFilter = {
      pairs: selectedPairs
        .filter(el => el.checked)
        .map(el => el.pair),
      exchanges: selectedExcanges
        .filter(el => el.checked)
        .map(el => el.exchange)
    }
    if (tickerEventContext.subscribe) {
      tickerEventContext.subscribe(subscriptionFilter);
    }
  }

  return (

    <FormGroup>
        <h3>Pairs</h3>
        <Divider  />
      { selectedPairs.map(pairElement => <FormControlLabel
        key={pairElement.pair}
        control={<Checkbox color="primary" checked={pairElement.checked} onChange={handlePairChange} name={pairElement.pair} />}
        label={pairElement.pair}
      />)
      }
      <h3>Exchanges</h3>
      <Divider  />
      { selectedExcanges.map(exchangeElement => <FormControlLabel
        key={exchangeElement.exchange}
        control={<Checkbox color="primary" checked={exchangeElement.checked} onChange={handleExchangeChange} name={exchangeElement.exchange} />}
        label={exchangeElement.exchange}
      />)
      }
      <Box marginTop={2}>
        <FormGroup>
          <Button onClick={handleSubscribe}>{ tickerEventContext.isSubscribed ? 'Unsubscribe' : 'Subscribe' }</Button>
        </FormGroup>
      </Box>
    </FormGroup>
  );
}