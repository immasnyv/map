
const cacheName = 'mapaPWA-v1';
const appShellFiles = [
    '/',
    '/index.php',
    '/sw.js',
    '/favicon.png',
    '/manifest.json',
    '/json/map2.js',
    '/json/map_nodes.js',
    '/js/api.js',
    '/js/classrooms.js',
    '/js/djikstra.js',
    '/js/main.js',
    '/js/map-handler.js',
    '/js/navigation.js',
    '/js/node-map.js',
    '/js/staff.js',
    '/css/style.css',
    '/images/logo64.png',
    '/images/logo128.png',
    '/images/logo256.png',
    '/images/logo512.png',
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(appShellFiles);
    })());
});


self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);
        //const cache = await caches.open(cacheName);
        //console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        //cache.put(e.request, response.clone());
        return response;
    })());
});