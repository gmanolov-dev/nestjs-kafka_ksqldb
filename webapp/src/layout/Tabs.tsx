import React, { useState } from 'react';
import { Ticker } from '../pages/Ticker';
import { Config } from '../pages/Config';
import AppBar from '@material-ui/core/AppBar';
import { Box, Tab as MuiTab, Tabs as MuiTabs } from '@material-ui/core';


export const Tabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <React.Fragment>
      <AppBar position="static">
          <MuiTabs value={tabIndex} onChange={(event, value) => setTabIndex(value)  } aria-label="simple tabs example">
            <MuiTab label="Config" />
            <MuiTab label="Ticker" />
          </MuiTabs>
      </AppBar>
      
      <Box mt={2}>
        { tabIndex === 0 && <Config  /> }
        { tabIndex === 1 && <Ticker  /> }
      </Box>
    </React.Fragment>
  );
}