/**
 * Service Worker for Fantasy Cricket App
 * Handles caching, offline functionality, and push notifications
 */

const CACHE_NAME = 'fantasy-cricket-v1';
const API_CACHE_NAME = 'fantasy-cricket-api-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/src/App.css'
];

// API routes that can be cached
const CACHEABLE_API_ROUTES = [
  '/api/matches',
  '/api/tournaments',
  '/api/teams'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http(s) requests (chrome-extension, etc.)
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else {
    // Handle static assets
    event.respondWith(handleStaticRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful GET requests
    if (response.status === 200 && request.method === 'GET') {
      const isCacheable = CACHEABLE_API_ROUTES.some(route => 
        url.pathname.includes(route)
      );
      
      if (isCacheable) {
        const cache = await caches.open(API_CACHE_NAME);
        cache.put(request, response.clone());
      }
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        success: false,
        message: 'You are offline. Please check your connection.',
        data: null
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Skip non-http(s) requests
    if (!request.url.startsWith('http')) {
      return fetch(request);
    }

    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try network
    const response = await fetch(request);
    
    // Cache successful responses for http(s) only
    if (response.status === 200 && request.url.startsWith('http')) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const cachedIndex = await caches.match('/index.html');
      if (cachedIndex) {
        return cachedIndex;
      }
    }
    
    throw error;
  }
}

// Handle push notifications
self.addEventListener('push', event => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'You have a new notification',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id || 1,
        url: data.url || '/'
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/xmark.png'
        }
      ],
      tag: data.tag || 'general',
      requireInteraction: data.requireInteraction || false
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Fantasy Cricket', options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
    
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('Fantasy Cricket', {
        body: 'You have a new notification',
        icon: '/icons/icon-192x192.png'
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll().then(clientList => {
      // Check if app is already open
      const hadWindowToFocus = clientList.some(client => {
        if (client.url === urlToOpen && 'focus' in client) {
          client.focus();
          return true;
        }
        return false;
      });

      // Open new window if app is not open
      if (!hadWindowToFocus) {
        clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle background sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Implement background sync logic here
    console.log('Background sync triggered');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle skip waiting message
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' });
  }
});