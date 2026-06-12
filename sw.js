const CACHE_NAME = 'taximeter-kolaka-v2';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                './index.html',
                './manifest.json',
                'https://i.ibb.co.com/5WgtxmZy/file-000000009040720cb7c1798a425f4a4e.png',
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            return new Response('Aplikasi membutuhkan koneksi atau belum di-cache penuh.');
        })
    );
});
