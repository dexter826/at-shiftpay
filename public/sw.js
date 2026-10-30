const CACHE_NAME = 'at-shiftpay-v4';
const SHELL_URLS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  '/brand/mark-reversed.svg',
  '/brand/lockup-white.svg',
];

const cacheBuildAssets = async (cache) => {
  try {
    const response = await fetch('/index.html', { cache: 'no-store' });
    if (!response.ok) return;

    const html = await response.text();
    const assets = [
      ...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g),
    ].map((match) => match[1]);

    if (assets.length > 0) {
      await cache.addAll([...new Set(assets)]);
    }
  } catch (error) {
    console.log('Build asset precache skipped:', error);
  }
};

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(SHELL_URLS).catch((error) => {
        console.log('Cache addAll error:', error);
      });
      await cacheBuildAssets(cache);
    })()
  );
  self.skipWaiting();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response to cache it
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        if (event.request.mode === 'navigate') {
          return caches
            .match('/index.html')
            .then((cached) => cached || caches.match('/'));
        }
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
