import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/app';
import { reportUnhandledErrors, requestPersistentStorage } from './app/report-errors';
import './globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

reportUnhandledErrors();
requestPersistentStorage();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
