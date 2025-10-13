// thyagarajsalome/dreamhome-pwa/dreamhome-pwa-e228f9cbd28c01dc658af560316564e882e1d39f/sw.js
const CACHE_NAME = "dreamhome-calculator-cache-v4"; // Incremented version
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

// fetch -start

// ✅ The corrected "Stale-While-Revalidate" code
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        // Go to the network to get a fresh version
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If we get a valid response, update the cache
          if (networkResponse) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // Return the cached version immediately if available,
        // otherwise wait for the network response.
        return response || fetchPromise;
      });
    })
  );
});

// fetch-end

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
