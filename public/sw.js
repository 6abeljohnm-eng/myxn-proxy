// ============ SERVICE WORKER ============

const CACHE_VERSION = 'studyhub-v4-cache';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/proxy.html',
  '/manifest.json',
];

// ============ INSTALL EVENT ============

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch((error) => {
        console.error('Service Worker: Cache error', error);
      })
  );
  self.skipWaiting();
});

// ============ ACTIVATE EVENT ============

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_VERSION)
            .map((cacheName) => {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
  );
  self.clients.claim();
});

// ============ FETCH EVENT ============

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (new URL(request.url).origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok && !request.url.includes('/api/')) {
              const responseClone = response.clone();
              caches.open(CACHE_VERSION)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch((error) => {
            console.error('Fetch error:', error);
            
            // Return offline page for HTML requests
            if (request.headers.get('Accept').includes('text/html')) {
              return new Response(
                '<h1>Offline</h1><p>No internet connection</p>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
          });
      })
  );
});

// ============ MESSAGE HANDLING ============

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_VERSION);
  }
});

// ============ PUSH NOTIFICATIONS ============

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon.png',
    badge: '/badge.png',
  };

  event.waitUntil(
    self.registration.showNotification('StudyHub', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
  );
});
