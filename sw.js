const CACHE_NAME = 'taxi-meter-v3';

// Daftar file inti yang wajib disimpan di perangkat agar PWA lolos verifikasi instalasi
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './logo.png', // Pastikan file logo.png benar-benar ada di GitHub Anda
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 1. Proses Install: Memaksa browser mengunduh semua file di atas ke latar belakang
self.addEventListener('install', event => {
    self.skipWaiting(); // Memaksa update Service Worker tanpa menunggu browser ditutup
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('SW: Menyimpan App Shell');
            return cache.addAll(APP_SHELL);
        })
    );
});

// 2. Proses Activate: Membersihkan cache versi lama agar tidak bentrok
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('SW: Menghapus cache lama', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Memastikan file ini langsung mengontrol halaman saat ini
});

// 3. Proses Fetch: Mencegat request internet, mengambil dari cache jika offline
self.addEventListener('fetch', event => {
    // Abaikan request dari ekstensi browser atau request yang bukan GET
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // Jika ada di cache, gunakan itu (mempercepat loading)
            if (cachedResponse) {
                return cachedResponse;
            }
            // Jika tidak ada, ambil dari internet
            return fetch(event.request).catch(() => {
                // Jika internet mati dan file tidak ada di cache
                return new Response('Anda sedang offline dan aset ini belum disimpan.');
            });
        })
    );
});
