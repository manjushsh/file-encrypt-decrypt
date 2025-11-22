import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GlobalStateProvider } from './context/GlobalStateContext';
import ErrorBoundary from './components/common/error-boundary';
import './css/index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

