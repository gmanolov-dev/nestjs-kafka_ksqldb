import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
} from '@material-ui/core';
import { SubscriptionFilterOptionsContext } from '../../providers/SubscriptionFilterOptionsProvider';
import { toConfigPairs } from '../../mappers/to-feed-pairs';

export const ConfigFeed = () => {
  const subscriptionFilterOptionsContext = useContext(SubscriptionFilterOptionsContext);
  const { exchangesConfig, updateConfig } = subscriptionFilterOptionsContext;

  const [selectedPairs, setSelectedPairs] = useState(toConfigPairs(exchangesConfig));

  useEffect(() => {
    setSelectedPairs(toConfigPairs(exchangesConfig));
  }, [exchangesConfig]);

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


  const handleConfigure = () => {
    
    const updateData = selectedPairs.map(el => ({
      exchange: el.exchange,
      pairs: el.pairs.reduce((acc, pair) => (
        {
          ...acc,
          [pair.pair]: pair.checked,
        }
      ), {})
    }));

    updateConfig(updateData);
  }

  return (

    <FormGroup>
      {selectedPairs.map(exchange => <Box key={exchange.exchange}>
        <h3>{exchange.exchange}</h3>
        <h4>Pairs</h4>
        {exchange.pairs.map(pairElement => <FormControlLabel

          key={`${pairElement.name}`}
          control={<Checkbox color="primary" checked={pairElement.checked} onChange={handlePairChange} name={pairElement.name} />}
          label={pairElement.pair}
        />)
        }
      </Box>)}

      <Box marginTop={2}>
        <FormGroup>
          <Button onClick={handleConfigure}>Configure</Button>
        </FormGroup>
      </Box>
    </FormGroup>
  );
}