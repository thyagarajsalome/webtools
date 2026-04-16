
// Service Worker: sw.js - UPDATED

const CACHE_NAME = "dreamhome-calculator-cache-v7"; // Incremented version
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/faq.html",
  "/privacy.html",
  "/terms.html",
  "/css/style.css",
  "/js/app.js",
  // Calculator Modules
  "/js/calculators/houseConstruction.js",
  "/js/calculators/painting.js",
  "/js/calculators/electrical.js",
  "/js/calculators/plumbing.js",
  "/js/calculators/flooring.js",
  "/js/calculators/doorsAndWindows.js",
  "/js/calculators/projects.js",
  "/js/calculators/emiCalculator.js", // <-- ADDED
  "/js/calculators/unitConverter.js", // <-- ADDED
  // ---
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "/images/logo-brand.png",
  // External Libraries
  "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
];

// Install Event: Cache essential assets
self.addEventListener("install", (event) => {
  // ... install logic ...
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache:", CACHE_NAME);
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache initial assets:", error);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener("activate", (event) => {
  // ... activate logic ...
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event: Serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // ... fetch logic ...
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          console.log("Network request failed, serving fallback.");
          return caches.match("/index.html");
        });
    })
  );
});

// Push Event Listener
self.addEventListener("push", (event) => {
  // ... push logic ...
  console.log("[Service Worker] Push Received.");
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error("Error parsing push data:", e);
      data = { title: "New Notification", body: event.data.text() };
    }
  } else {
    data = { title: "DreamHome Calculator", body: "Something new happened!" };
  }
  const title = data.title || "DreamHome Calculator";
  const options = {
    body: data.body || "Check the app for details.",
    icon: "/images/icon-192x192.png",
    badge: "/images/icon-192x192.png",
    data: data.url || { url: "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Event Listener
self.addEventListener("notificationclick", (event) => {
  // ... notification click logic ...
  console.log("[Service Worker] Notification click Received.");
  event.notification.close();
  const urlToOpen = event.notification.data.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === urlToOpen ? (windowClient.focus(), true) : false
      );
      if (!hadWindowToFocus)
        clients
          .openWindow(urlToOpen)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});

// Service Worker: sw.js - UPDATED

const CACHE_NAME = "dreamhome-calculator-cache-v7"; // Incremented version
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/faq.html",
  "/privacy.html",
  "/terms.html",
  "/css/style.css",
  "/js/app.js",
  // Calculator Modules
  "/js/calculators/houseConstruction.js",
  "/js/calculators/painting.js",
  "/js/calculators/electrical.js",
  "/js/calculators/plumbing.js",
  "/js/calculators/flooring.js",
  "/js/calculators/doorsAndWindows.js",
  "/js/calculators/projects.js",
  "/js/calculators/emiCalculator.js", // <-- ADDED
  "/js/calculators/unitConverter.js", // <-- ADDED
  // ---
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "/images/logo-brand.png",
  // External Libraries
  "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
];

// Install Event: Cache essential assets
self.addEventListener("install", (event) => {
  // ... install logic ...
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache:", CACHE_NAME);
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache initial assets:", error);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener("activate", (event) => {
  // ... activate logic ...
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event: Serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // ... fetch logic ...
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          console.log("Network request failed, serving fallback.");
          return caches.match("/index.html");
        });
    })
  );
});

// Push Event Listener
self.addEventListener("push", (event) => {
  // ... push logic ...
  console.log("[Service Worker] Push Received.");
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error("Error parsing push data:", e);
      data = { title: "New Notification", body: event.data.text() };
    }
  } else {
    data = { title: "DreamHome Calculator", body: "Something new happened!" };
  }
  const title = data.title || "DreamHome Calculator";
  const options = {
    body: data.body || "Check the app for details.",
    icon: "/images/icon-192x192.png",
    badge: "/images/icon-192x192.png",
    data: data.url || { url: "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Event Listener
self.addEventListener("notificationclick", (event) => {
  // ... notification click logic ...
  console.log("[Service Worker] Notification click Received.");
  event.notification.close();
  const urlToOpen = event.notification.data.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === urlToOpen ? (windowClient.focus(), true) : false
      );
      if (!hadWindowToFocus)
        clients
          .openWindow(urlToOpen)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});

