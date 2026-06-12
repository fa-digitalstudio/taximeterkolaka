const CACHE_NAME = 'taximeter-kolaka-v1';

// Cache dasar agar minimal lulus persyaratan PWA install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                './index.html',
                './manifest.json',
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
                'https://i.ibb.co.com/5WgtxmZy/file-000000009040720cb7c1798a425f4a4e.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            // Fallback kosong (jika offline)
            return new Response('Aplikasi membutuhkan koneksi atau belum di-cache penuh.');
        })
    );
});
