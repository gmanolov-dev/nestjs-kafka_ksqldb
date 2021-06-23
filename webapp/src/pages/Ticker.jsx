import React from 'react';
import { Box, Grid, Paper } from '@material-ui/core';
import { SubscriptionChooser } from '../features/subscription-chooser/SubscriptionChooser';
import { Dashboard } from '../features/dashboard/Dashboard';

export const Ticker = () => {

  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper>
          <Box p={4}>
            <SubscriptionChooser />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Dashboard />
      </Grid>
    </Grid>
  );

}