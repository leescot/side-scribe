import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../utils/theme';
import Panel from './Panel';

// Initialize the panel app
const init = async () => {
  // Get theme preference from storage
  const theme = 'light'; // Default to light theme, will be replaced with storage value
  
  // Render the panel app
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider theme={createAppTheme(theme as 'light' | 'dark')}>
        <CssBaseline />
        <Panel />
      </ThemeProvider>
    </React.StrictMode>
  );
};

// Start the app
init(); 