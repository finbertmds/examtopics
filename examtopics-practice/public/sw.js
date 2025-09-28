/**
 * Service Worker for ExamTopics Practice App
 * Provides offline support, caching, and background sync
 */

const CACHE_NAME = 'examtopics-v1';
const STATIC_CACHE_NAME = 'examtopics-static-v1';
const DYNAMIC_CACHE_NAME = 'examtopics-dynamic-v1';
const API_CACHE_NAME = 'examtopics-api-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/progress/',
  '/auth/',
  '/report',
  '/stats/',
  '/history'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES).catch((error) => {
          console.warn('Some static files failed to cache:', error);
          // Continue even if some files fail to cache
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static files:', error);
        // Still skip waiting even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/progress/') ||
      url.pathname.startsWith('/auth/') ||
      url.pathname.startsWith('/report') ||
      url.pathname.startsWith('/stats/') ||
      url.pathname.startsWith('/history')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static files (JS, CSS, images)
  if (url.pathname.startsWith('/static/') || 
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.gif') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.ico')) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle HTML pages
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  // Handle other requests
  event.respondWith(handleOtherRequest(request));
});

// API request handler - Network First with Cache Fallback
async function handleApiRequest(request) {
  // Skip caching for unsupported schemes
  if (request.url.startsWith('chrome-extension:') || 
      request.url.startsWith('moz-extension:') || 
      request.url.startsWith('safari-extension:') ||
      request.url.startsWith('edge-extension:')) {
    return fetch(request);
  }

  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      try {
        const cache = await caches.open(API_CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn('Failed to cache API response:', request.url, cacheError);
        // Continue without caching
      }
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed for API request, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Offline',
        message: 'No internet connection and no cached data available'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Static file handler - Cache First
async function handleStaticRequest(request) {
  // Skip caching for unsupported schemes
  if (request.url.startsWith('chrome-extension:') || 
      request.url.startsWith('moz-extension:') || 
      request.url.startsWith('safari-extension:') ||
      request.url.startsWith('edge-extension:')) {
    return fetch(request);
  }

  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn('Failed to cache response:', request.url, cacheError);
        // Continue without caching
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static file:', request.url, error);
    return new Response('Static file not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Page request handler - Network First with Cache Fallback
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed for page request, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to index.html for SPA routing
    const indexResponse = await caches.match('/');
    if (indexResponse) {
      return indexResponse;
    }
    
    return new Response('Page not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Other request handler - Cache First with Network Fallback
async function handleOtherRequest(request) {
  // Skip caching for unsupported schemes
  if (request.url.startsWith('chrome-extension:') || 
      request.url.startsWith('moz-extension:') || 
      request.url.startsWith('safari-extension:') ||
      request.url.startsWith('edge-extension:')) {
    return fetch(request);
  }

  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn('Failed to cache other response:', request.url, cacheError);
        // Continue without caching
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch resource:', request.url, error);
    return new Response('Resource not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get queued actions from IndexedDB or localStorage
    const queuedActions = await getQueuedActions();
    
    if (queuedActions.length === 0) {
      console.log('No queued actions to sync');
      return;
    }
    
    console.log(`Syncing ${queuedActions.length} queued actions`);
    
    for (const action of queuedActions) {
      try {
        await syncAction(action);
        await removeQueuedAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getQueuedActions() {
  // This would typically read from IndexedDB
  // For now, return empty array
  return [];
}

async function syncAction(action) {
  // This would typically make API calls to sync the action
  console.log('Syncing action:', action);
}

async function removeQueuedAction(actionId) {
  // This would typically remove from IndexedDB
  console.log('Removing queued action:', actionId);
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'examtopics-notification',
      data: data.data
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker loaded successfully');
