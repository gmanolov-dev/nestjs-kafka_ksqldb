import React from 'react';
import { Box, Grid, Paper } from '@material-ui/core';
import { ConfigFeed } from '../features/config-feed/ConfigFeed';

export const Config = () => {

  return <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper>
          <Box p={4}>
            <ConfigFeed />
          </Box>
        </Paper>
      </Grid>
    </Grid>
}