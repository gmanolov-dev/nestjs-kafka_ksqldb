import React, { useContext } from 'react';
import { TickerEventContext } from '../../providers/TickerEventProvider';
import { Box, Grid, Paper } from '@material-ui/core';

export const Dashboard = () => {

  const tickerEventContext = useContext(TickerEventContext);

  return <Paper>
    <Box p={3}><h3>Dashboard</h3></Box>
    <Box p={3}>
      {tickerEventContext.tickerEvents.map(el => <Grid key={`${el.exchange}-${el.pair}`} container>
        <Grid item xs={4}>{el.exchange}</Grid>
        <Grid item xs={4}>{el.pair}</Grid>
        <Grid item xs={2}>{el.price}</Grid>
        <Grid item xs={2}>{el.type}</Grid>
      </Grid>)}
    </Box>
  </Paper>;
}