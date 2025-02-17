const cacheName = "echelonstudios-Imposter Red Alert-1.0.0";
const contentToCache = [
    "Build/LamHD-DPT.github.io.loader.js?v=1.0.0",
    "Build/LamHD-DPT.github.io.framework.js.gz?v=1.0.0",
    "Build/LamHD-DPT.github.io.data.gz?v=1.0.0",
    "Build/LamHD-DPT.github.io.wasm.gz?v=1.0.0",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
