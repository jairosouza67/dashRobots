
const CACHE_NAME = 'respirazen-v1';
const STATIC_CACHE = 'respirazen-static-v1';
const DYNAMIC_CACHE = 'respirazen-dynamic-v1';

const staticAssets = [
  '/',
  '/respirar',
  '/dashboard',
  '/comunidade',
  '/manifest.json',
  '/water-background.jpg',
  // Add your static assets here
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(staticAssets);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then(fetchResponse => {
          // Check if we received a valid response
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          // Clone the response
          const responseToCache = fetchResponse.clone();

          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return fetchResponse;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'breathing-session') {
    event.waitUntil(syncBreathingData());
  }
});

// Push notification support
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Hora de respirar! 🧘‍♀️',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'breathing',
        title: 'Começar Respiração'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('RespiraZen', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'breathing') {
    event.waitUntil(
      clients.openWindow('/respirar')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync breathing data
async function syncBreathingData() {
  // This would sync offline breathing sessions when back online
  console.log('Syncing breathing data...');
}
