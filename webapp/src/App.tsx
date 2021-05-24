import React from 'react';
import { Box, Grid, Paper, Container } from '@material-ui/core';
import { SubscriptionChooser } from './features/subscription-chooser/SubscriptionChooser';
import { Dashboard } from './features/dashboard/Dashboard';
import { SubscriptionFilterOptionsProvider } from './providers/SubscriptionFilterOptionsProvider';
import { TickerEventProvider } from './providers/TickerEventProvider';

function App() {
  return (
    <Container maxWidth="lg">
      <SubscriptionFilterOptionsProvider>
        <TickerEventProvider>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Paper>
                <Box p={4}>
                  <SubscriptionChooser />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Dashboard />
            </Grid>
          </Grid>
        </TickerEventProvider>
      </SubscriptionFilterOptionsProvider>
    </Container>

  );
}

export default App;
