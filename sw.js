const CACHE_NAME = 'Totil Studio-v11';

// Core assets to pre-cache
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/os.html',
  '/style.css',
  '/nav.js',
  '/manifest.json',
  '/calculators/index.html',
  '/converters/index.html',
  '/tools/index.html'
];

// Install event: Pre-cache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network-First strategy for HTML, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  // We only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // If it's an HTML file or root, use Network-First
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone and cache the new response
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request);
        })
    );
  } else {
    // For CSS, JS, images, fonts: Cache-First
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          // Don't cache opaque responses or errors
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          return response;
        }).catch(err => {
          console.error('[SW] Fetch failed:', err);
        });
      })
    );
  }
});
