const CACHE_NAME = 'my-calendar-v1';

// List all local files you want cached for offline use
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// 1. Install Event: Cache essential app assets
self.addEventListener('install', event => {
    self.skipWaiting(); // Forces the waiting service worker to become the active service worker
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Activate Event: Clean up old caches if the version name changes
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Fetch Event: Stale-while-revalidate or Network-first strategy
self.addEventListener('fetch', event => {
    // Only intercept basic HTTP/HTTPS requests (ignore extensions or external auth flows if needed)
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached response if found
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Otherwise, fetch from the network
                return fetch(event.request).catch(() => {
                    // Optional: If network fails and it's an HTML request, you could return an offline page here
                    console.log('Network request failed, and no cache found for: ', event.request.url);
                });
            })
    );
});