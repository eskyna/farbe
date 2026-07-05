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
  "/farbe/i18n.js",
  "/farbe/palette-app.js",
  "/farbe/assets/sign_gold.png",
  "/farbe/assets/app-icon.png",
  "/farbe/assets/splash-portrait.jpg",
  "/farbe/assets/splash-landscape.jpg",
  "/farbe/assets/app-background.jpg",
  "/farbe/icons/icon-192.png",
  "/farbe/icons/icon-512.png",
  "/farbe/icons/icon-maskable-192.png",
  "/farbe/icons/icon-maskable-512.png",
  "/farbe/icons/apple-touch-icon.png",
  ...__ESKYNA_PALETTE_SHELL__,
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

