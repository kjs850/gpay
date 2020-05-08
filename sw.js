self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('video-store').then(function(cache) {
            return cache.addAll([
                '/index.html',
                '/jquery-3.4.1.min.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    // console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});