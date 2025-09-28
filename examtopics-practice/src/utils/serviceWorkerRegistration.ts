/**
 * Service Worker Registration
 * Handles registration and updates of the service worker
 */

import { Workbox } from 'workbox-window';
import { autoFixReloadLoop } from './autoFix';

let wb: Workbox | null = null;

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Check if we should skip service worker registration due to reload issues
    if (autoFixReloadLoop.shouldSkipServiceWorker()) {
      console.log('Skipping Service Worker registration due to previous issues');
      return;
    }
    
    // Use Workbox for better service worker management
    wb = new Workbox('/sw.js');
    
    wb.addEventListener('controlling', () => {
      console.log('Service Worker is now controlling the page');
      // Optionally reload the page to get the latest version
      // window.location.reload();
    });
    
    wb.addEventListener('waiting', () => {
      console.log('New service worker is waiting');
      // Show update notification to user
      showUpdateNotification();
    });
    
    wb.addEventListener('activated', () => {
      console.log('Service Worker activated');
    });
    
    wb.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('Cache updated:', event.data.payload);
      }
    });
    
    // Register the service worker
    wb.register()
      .then((registration) => {
        console.log('Service Worker registered successfully');
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
        // If service worker registration fails, mark to skip it
        sessionStorage.setItem('skipServiceWorker', 'true');
      });
  } else {
    console.log('Service Worker not supported');
  }
}

function showUpdateNotification() {
  // Show a notification to the user about the update
  if (window.confirm('A new version of the app is available. Would you like to update?')) {
    if (wb) {
      wb.messageSkipWaiting();
    }
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

export { wb };
