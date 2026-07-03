const APP_VERSION = "__ESKYNA_APP_VERSION__";
const CACHE_NAME = `eskyna-farben-${APP_VERSION}`;
const FALLBACK_URL = "/farbe/";
const APP_SHELL = [
  "/farbe/",
  "/farbe/index.html",
  "/farbe/version.json",
  "/farbe/manifest.webmanifest",
  "/farbe/styles.css",
  "/farbe/palettes.js",
  "/farbe/overview.js",
  "/farbe/palette-app.js",
  "/farbe/assets/sign_gold.png",
  "/farbe/assets/splash-portrait.jpg",
  "/farbe/assets/splash-landscape.jpg",
  "/farbe/assets/app-background.jpg",
  "/farbe/icons/icon-192.png",
  "/farbe/icons/icon-512.png",
  "/farbe/icons/apple-touch-icon.png",
  "/farbe/light_cool_clear/",
  "/farbe/light_cool_clear/index.html",
  "/farbe/light_cool_clear/manifest.webmanifest",
  "/farbe/icons/light_cool_clear.png",
  "/farbe/icons/light_cool_clear-192.png",
  "/farbe/icons/light_cool_clear-512.png",
  "/farbe/icons/light_cool_clear-apple-touch-icon.png",
  "/farbe/light_cool_soft/",
  "/farbe/light_cool_soft/index.html",
  "/farbe/light_cool_soft/manifest.webmanifest",
  "/farbe/icons/light_cool_soft.png",
  "/farbe/icons/light_cool_soft-192.png",
  "/farbe/icons/light_cool_soft-512.png",
  "/farbe/icons/light_cool_soft-apple-touch-icon.png",
  "/farbe/light_warm_clear/",
  "/farbe/light_warm_clear/index.html",
  "/farbe/light_warm_clear/manifest.webmanifest",
  "/farbe/icons/light_warm_clear.png",
  "/farbe/icons/light_warm_clear-192.png",
  "/farbe/icons/light_warm_clear-512.png",
  "/farbe/icons/light_warm_clear-apple-touch-icon.png",
  "/farbe/light_warm_soft/",
  "/farbe/light_warm_soft/index.html",
  "/farbe/light_warm_soft/manifest.webmanifest",
  "/farbe/icons/light_warm_soft.png",
  "/farbe/icons/light_warm_soft-192.png",
  "/farbe/icons/light_warm_soft-512.png",
  "/farbe/icons/light_warm_soft-apple-touch-icon.png",
  "/farbe/deep_cool_clear/",
  "/farbe/deep_cool_clear/index.html",
  "/farbe/deep_cool_clear/manifest.webmanifest",
  "/farbe/icons/deep_cool_clear.png",
  "/farbe/icons/deep_cool_clear-192.png",
  "/farbe/icons/deep_cool_clear-512.png",
  "/farbe/icons/deep_cool_clear-apple-touch-icon.png",
  "/farbe/deep_cool_soft/",
  "/farbe/deep_cool_soft/index.html",
  "/farbe/deep_cool_soft/manifest.webmanifest",
  "/farbe/icons/deep_cool_soft.png",
  "/farbe/icons/deep_cool_soft-192.png",
  "/farbe/icons/deep_cool_soft-512.png",
  "/farbe/icons/deep_cool_soft-apple-touch-icon.png",
  "/farbe/deep_warm_clear/",
  "/farbe/deep_warm_clear/index.html",
  "/farbe/deep_warm_clear/manifest.webmanifest",
  "/farbe/icons/deep_warm_clear.png",
  "/farbe/icons/deep_warm_clear-192.png",
  "/farbe/icons/deep_warm_clear-512.png",
  "/farbe/icons/deep_warm_clear-apple-touch-icon.png",
  "/farbe/deep_warm_soft/",
  "/farbe/deep_warm_soft/index.html",
  "/farbe/deep_warm_soft/manifest.webmanifest",
  "/farbe/icons/deep_warm_soft.png",
  "/farbe/icons/deep_warm_soft-192.png",
  "/farbe/icons/deep_warm_soft-512.png",
  "/farbe/icons/deep_warm_soft-apple-touch-icon.png",
  "/farbe/warm_clear_light/",
  "/farbe/warm_clear_light/index.html",
  "/farbe/warm_clear_light/manifest.webmanifest",
  "/farbe/icons/warm_clear_light.png",
  "/farbe/icons/warm_clear_light-192.png",
  "/farbe/icons/warm_clear_light-512.png",
  "/farbe/icons/warm_clear_light-apple-touch-icon.png",
  "/farbe/warm_clear_deep/",
  "/farbe/warm_clear_deep/index.html",
  "/farbe/warm_clear_deep/manifest.webmanifest",
  "/farbe/icons/warm_clear_deep.png",
  "/farbe/icons/warm_clear_deep-192.png",
  "/farbe/icons/warm_clear_deep-512.png",
  "/farbe/icons/warm_clear_deep-apple-touch-icon.png",
  "/farbe/warm_soft_light/",
  "/farbe/warm_soft_light/index.html",
  "/farbe/warm_soft_light/manifest.webmanifest",
  "/farbe/icons/warm_soft_light.png",
  "/farbe/icons/warm_soft_light-192.png",
  "/farbe/icons/warm_soft_light-512.png",
  "/farbe/icons/warm_soft_light-apple-touch-icon.png",
  "/farbe/warm_soft_deep/",
  "/farbe/warm_soft_deep/index.html",
  "/farbe/warm_soft_deep/manifest.webmanifest",
  "/farbe/icons/warm_soft_deep.png",
  "/farbe/icons/warm_soft_deep-192.png",
  "/farbe/icons/warm_soft_deep-512.png",
  "/farbe/icons/warm_soft_deep-apple-touch-icon.png",
  "/farbe/cool_clear_light/",
  "/farbe/cool_clear_light/index.html",
  "/farbe/cool_clear_light/manifest.webmanifest",
  "/farbe/icons/cool_clear_light.png",
  "/farbe/icons/cool_clear_light-192.png",
  "/farbe/icons/cool_clear_light-512.png",
  "/farbe/icons/cool_clear_light-apple-touch-icon.png",
  "/farbe/cool_clear_deep/",
  "/farbe/cool_clear_deep/index.html",
  "/farbe/cool_clear_deep/manifest.webmanifest",
  "/farbe/icons/cool_clear_deep.png",
  "/farbe/icons/cool_clear_deep-192.png",
  "/farbe/icons/cool_clear_deep-512.png",
  "/farbe/icons/cool_clear_deep-apple-touch-icon.png",
  "/farbe/cool_soft_light/",
  "/farbe/cool_soft_light/index.html",
  "/farbe/cool_soft_light/manifest.webmanifest",
  "/farbe/icons/cool_soft_light.png",
  "/farbe/icons/cool_soft_light-192.png",
  "/farbe/icons/cool_soft_light-512.png",
  "/farbe/icons/cool_soft_light-apple-touch-icon.png",
  "/farbe/cool_soft_deep/",
  "/farbe/cool_soft_deep/index.html",
  "/farbe/cool_soft_deep/manifest.webmanifest",
  "/farbe/icons/cool_soft_deep.png",
  "/farbe/icons/cool_soft_deep-192.png",
  "/farbe/icons/cool_soft_deep-512.png",
  "/farbe/icons/cool_soft_deep-apple-touch-icon.png",
  "/farbe/soft_cool_light/",
  "/farbe/soft_cool_light/index.html",
  "/farbe/soft_cool_light/manifest.webmanifest",
  "/farbe/icons/soft_cool_light.png",
  "/farbe/icons/soft_cool_light-192.png",
  "/farbe/icons/soft_cool_light-512.png",
  "/farbe/icons/soft_cool_light-apple-touch-icon.png",
  "/farbe/soft_cool_deep/",
  "/farbe/soft_cool_deep/index.html",
  "/farbe/soft_cool_deep/manifest.webmanifest",
  "/farbe/icons/soft_cool_deep.png",
  "/farbe/icons/soft_cool_deep-192.png",
  "/farbe/icons/soft_cool_deep-512.png",
  "/farbe/icons/soft_cool_deep-apple-touch-icon.png",
  "/farbe/soft_warm_light/",
  "/farbe/soft_warm_light/index.html",
  "/farbe/soft_warm_light/manifest.webmanifest",
  "/farbe/icons/soft_warm_light.png",
  "/farbe/icons/soft_warm_light-192.png",
  "/farbe/icons/soft_warm_light-512.png",
  "/farbe/icons/soft_warm_light-apple-touch-icon.png",
  "/farbe/soft_warm_deep/",
  "/farbe/soft_warm_deep/index.html",
  "/farbe/soft_warm_deep/manifest.webmanifest",
  "/farbe/icons/soft_warm_deep.png",
  "/farbe/icons/soft_warm_deep-192.png",
  "/farbe/icons/soft_warm_deep-512.png",
  "/farbe/icons/soft_warm_deep-apple-touch-icon.png",
  "/farbe/clear_cool_light/",
  "/farbe/clear_cool_light/index.html",
  "/farbe/clear_cool_light/manifest.webmanifest",
  "/farbe/icons/clear_cool_light.png",
  "/farbe/icons/clear_cool_light-192.png",
  "/farbe/icons/clear_cool_light-512.png",
  "/farbe/icons/clear_cool_light-apple-touch-icon.png",
  "/farbe/clear_cool_deep/",
  "/farbe/clear_cool_deep/index.html",
  "/farbe/clear_cool_deep/manifest.webmanifest",
  "/farbe/icons/clear_cool_deep.png",
  "/farbe/icons/clear_cool_deep-192.png",
  "/farbe/icons/clear_cool_deep-512.png",
  "/farbe/icons/clear_cool_deep-apple-touch-icon.png",
  "/farbe/clear_warm_light/",
  "/farbe/clear_warm_light/index.html",
  "/farbe/clear_warm_light/manifest.webmanifest",
  "/farbe/icons/clear_warm_light.png",
  "/farbe/icons/clear_warm_light-192.png",
  "/farbe/icons/clear_warm_light-512.png",
  "/farbe/icons/clear_warm_light-apple-touch-icon.png",
  "/farbe/clear_warm_deep/",
  "/farbe/clear_warm_deep/index.html",
  "/farbe/clear_warm_deep/manifest.webmanifest",
  "/farbe/icons/clear_warm_deep.png",
  "/farbe/icons/clear_warm_deep-192.png",
  "/farbe/icons/clear_warm_deep-512.png",
  "/farbe/icons/clear_warm_deep-apple-touch-icon.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('eskyna-farben-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (shouldPreferNetwork(event.request, url)) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});

function shouldPreferNetwork(request, url) {
  return request.mode === 'navigate'
    || request.destination === 'document'
    || request.destination === 'script'
    || request.destination === 'style'
    || request.destination === 'manifest'
    || url.pathname.endsWith('/version.json')
    || url.pathname.endsWith('.html')
    || url.pathname.endsWith('.js')
    || url.pathname.endsWith('.css')
    || url.pathname.endsWith('.webmanifest');
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone()).catch(() => {});
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return caches.match(FALLBACK_URL);
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const update = fetch(request).then(async (response) => {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone()).catch(() => {});
    return response;
  }).catch(() => null);
  return cached || update;
}
