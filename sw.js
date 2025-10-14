// thyagarajsalome/dreamhome-pwa/dreamhome-pwa-e228f9cbd28c01dc658af560316564e882e1d39f/sw.js
const CACHE_NAME = "dreamhome-calculator-cache-v3"; // Incremented version
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/faq.html",
  "/privacy.html",
  "/terms.html",
  "/css/style.css",
  "/js/app.js",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => caches.match("/index.html")); // Fallback to home page if network fails
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
