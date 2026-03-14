import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';
import { analytics, firebaseEnabled } from './helpers/firebase';
import ErrorBoundary from './components/ErrorBoundary';
import Simulator from './components/Simulator';
import Loading from './components/Loading';
import { loadDiagram, persistor, store } from './store/store';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CustomDragLayer } from './CustomDragLayer';

type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  mode: ColorMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleColorMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

if (firebaseEnabled && analytics) {
  analytics.logEvent('app_init');
}

loadDiagram();

export default function App() {
  const [mode, setMode] = useState<ColorMode>(() => {
    const saved = localStorage.getItem('colorMode');
    return (saved === 'dark' ? 'dark' : 'light') as ColorMode;
  });

  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const next: ColorMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('colorMode', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  // Apply data-theme on initial render
  React.useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const colorModeValue = useMemo(() => ({ mode, toggleColorMode }), [mode, toggleColorMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorModeValue}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <ErrorBoundary>
            <DndProvider backend={HTML5Backend}>
              <CustomDragLayer />
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Simulator />
              </ThemeProvider>
            </DndProvider>
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </ColorModeContext.Provider>
  );
}

serviceWorkerRegistration.register();
