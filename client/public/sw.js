// Service Worker for Vibes Mobile PWA
const CACHE_NAME = 'vibes-mobile-v1';
const OFFLINE_PAGE = '/offline.html';

// Critical resources for mobile app functionality
const urlsToCache = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Core app routes
  '/dashboard',
  '/create-event',
  '/find-events',
  '/vibe-mall',
  // Essential assets
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache resources and skip waiting
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting(); // Force activation of new service worker
      })
  );
});

// Activate event - claim clients and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - Network First with Cache Fallback for mobile
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we got a valid response, clone it and cache it
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // If it's a navigation request and no cache, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_PAGE);
            }
            throw new Error('Network failed and no cache available');
          });
      })
  );
});

// Background Sync - for when the app comes back online
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync any pending data when connection is restored
      syncPendingData()
    );
  }
});

// Push Notifications - for mobile app-like notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New event update!',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Event',
        icon: '/icon-72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Vibes', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received.');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Notification closed
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync pending data
async function syncPendingData() {
  try {
    // Implement your background sync logic here
    console.log('[SW] Syncing pending data...');
    
    // Example: sync offline actions, upload queued data, etc.
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      await processPendingAction(action);
    }
    
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Helper functions for background sync
async function getPendingActions() {
  // Get pending actions from IndexedDB or local storage
  return [];
}

async function processPendingAction(action) {
  // Process each pending action
  console.log('[SW] Processing action:', action);
}

// Message handler for communication with app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({type: 'VERSION', version: CACHE_NAME});
  }
});