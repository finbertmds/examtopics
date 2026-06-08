import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { autoFixReloadLoop } from './utils/autoFix';
import { cleanupLegacyCache } from './utils/legacyCacheCleanup';

const bootstrap = async () => {
  try {
    if (autoFixReloadLoop.isInReloadLoop()) {
      console.log('Detected reload loop, auto-fixing...');
      await autoFixReloadLoop.clearAll();
      autoFixReloadLoop.notifyAndReload();
      return;
    }

    autoFixReloadLoop.updateReloadCounter();
    await cleanupLegacyCache();
  } catch (error) {
    console.error('Error during app bootstrap:', error);
  }

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  reportWebVitals();
};

bootstrap();
