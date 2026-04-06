const CACHE_NAME = 'chromatic-tuner-v1';

// List of files to cache for offline use
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    // Uncomment these once you add your image files to the folder
    // './icon-192.png',
    // './icon-512.png'
];

// 1. Install Event - Caches the assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// 2. Fetch Event - Serves files from cache if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return the cached version if found, otherwise fetch from the network
                return response || fetch(event.request);
            })
    );
});

// 3. Activate Event - Cleans up old caches if you update the CACHE_NAME version
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the Service Worker takes control immediately
    self.clients.claim();
});