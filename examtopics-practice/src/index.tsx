import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { dataService } from './services/dataService';
import { networkService } from './services/networkService';
import { autoFixReloadLoop } from './utils/autoFix';
import { registerServiceWorker } from './utils/serviceWorkerRegistration';

// Auto-fix reload loop issues
const handleAutoFix = async () => {
  try {
    // Check if we're in a reload loop
    if (autoFixReloadLoop.isInReloadLoop()) {
      console.log('Detected reload loop, auto-fixing...');
      await autoFixReloadLoop.clearAll();
      autoFixReloadLoop.notifyAndReload();
      return;
    }

    // Update reload counter
    autoFixReloadLoop.updateReloadCounter();

  } catch (error) {
    console.error('Error in auto-fix:', error);
  }
};

// Run auto-fix check immediately
handleAutoFix();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Initialize services after app starts (only if not in reload loop)
setTimeout(() => {
  if (!autoFixReloadLoop.isInReloadLoop()) {
    console.log('Initializing services...');
    dataService.init();
    networkService.init();
    console.log('Services initialized');
  }
}, 1000);

// Register service worker for offline support (only if not in reload loop)
if (!autoFixReloadLoop.isInReloadLoop()) {
  registerServiceWorker();
}
