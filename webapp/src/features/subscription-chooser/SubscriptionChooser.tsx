import React, { ChangeEvent, useContext, useEffect, useState } from 'react';

import {
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
} from '@material-ui/core';

import { TickerEventContext } from '../../providers/TickerEventProvider';
import { SubscriptionFilterOptionsContext } from '../../providers/SubscriptionFilterOptionsProvider';
import { SubscriptionFilter } from '../../model';
import { toSubscriptionPairs } from '../../mappers/to-feed-pairs';


export const SubscriptionChooser = () => {
  const { selectedFilter, unsubscribe, subscribe } = useContext(TickerEventContext);
  const { exchangesConfig } = useContext(SubscriptionFilterOptionsContext);

  const [selectedPairs, setSelectedPairs] = useState(toSubscriptionPairs(exchangesConfig, selectedFilter));

  useEffect(() => {
    setSelectedPairs(toSubscriptionPairs(exchangesConfig, selectedFilter));
  }, [exchangesConfig])

  const handlePairChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPairs = [...selectedPairs];
    
    const modifiedExchange = newPairs.find(el => el.pairs.find(pair => pair.name === event.target.name));
    
    if (!modifiedExchange) {
      return;
      
    }
    const modifiedPair = modifiedExchange.pairs.find(pair => pair.name === event.target.name);
    if (!modifiedPair) {
      return;
    }
    
    modifiedPair.checked = event.target.checked;
    setSelectedPairs(newPairs);
  };


  const handleSubscribe = () => {
    if (selectedFilter.length && unsubscribe) {
      unsubscribe();
      return;
    }

    const subscriptionFilter: SubscriptionFilter[] = selectedPairs
      .filter(el => el.pairs.filter(pair => pair.checked).length > 0)
      .map(el => ({
        exchange: el.exchange,
        pairs: el.pairs
          .filter(pair => pair.checked)
          .map(pair => pair.pair)
      }));

    if (subscribe) {
      subscribe(subscriptionFilter);
    }
  }

  return (

    <FormGroup>
      {selectedPairs.map(exchange => <Box key={exchange.exchange}>
        <h3>{exchange.exchange}</h3>
        <h4>Pairs</h4>
        {exchange.pairs.map(pairElement => <FormControlLabel
        
          disabled={pairElement.disabled}
          key={`${pairElement.name}`}
          control={<Checkbox color="primary" checked={pairElement.checked} onChange={handlePairChange} name={pairElement.name} />}
          label={pairElement.pair}
        />)
        }
      </Box>)}

      <Box marginTop={2}>
        <FormGroup>
          <Button onClick={handleSubscribe}>{selectedFilter.length ? 'Unsubscribe' : 'Subscribe'}</Button>
        </FormGroup>
      </Box>
    </FormGroup>
  );
}