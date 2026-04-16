// Service Worker: sw.js - UPDATED

const CACHE_NAME = "dreamhome-calculator-cache-v7"; 
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/faq.html",
  "/privacy.html",
  "/terms.html",
  "/css/style.css",
  "/js/app.js",
  "/js/calculators/houseConstruction.js",
  "/js/calculators/painting.js",
  "/js/calculators/electrical.js",
  "/js/calculators/plumbing.js",
  "/js/calculators/flooring.js",
  "/js/calculators/doorsAndWindows.js",
  "/js/calculators/projects.js",
  "/js/calculators/emiCalculator.js", 
  "/js/calculators/unitConverter.js", 
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "/images/logo-brand.png",
  "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache initial assets:", error);
      });
    })
  );
  self.skipWaiting();
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
      }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).catch(() => {
          return caches.match("/index.html");
        });
    })
  );
});

self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try { data = event.data.json(); } catch (e) { data = { title: "New Notification", body: event.data.text() }; }
  } else {
    data = { title: "DreamHome Calculator", body: "Something new happened!" };
  }
  event.waitUntil(self.registration.showNotification(data.title || "DreamHome Calculator", {
    body: data.body || "Check the app for details.",
    icon: "/images/icon-192x192.png",
    badge: "/images/icon-192x192.png",
    data: data.url || { url: "/" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === urlToOpen ? (windowClient.focus(), true) : false
      );
      if (!hadWindowToFocus) clients.openWindow(urlToOpen).then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});