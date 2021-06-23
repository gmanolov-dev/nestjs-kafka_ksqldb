import React from 'react';
import { Container } from '@material-ui/core';
import { SubscriptionFilterOptionsProvider } from './providers/SubscriptionFilterOptionsProvider';
import { TickerEventProvider } from './providers/TickerEventProvider';
import { Layout } from './layout/Layout';

function App() {
  return (
    <Container maxWidth="lg">
      <SubscriptionFilterOptionsProvider>
        <TickerEventProvider>
          <Layout />
        </TickerEventProvider>
      </SubscriptionFilterOptionsProvider>
    </Container>

  );
}

export default App;
