// Service Worker: sw.js

const CACHE_NAME = "dreamhome-calculator-cache-v5"; // Incremented version
const urlsToCache = [
  "/", // Make sure your server serves index.html for '/'
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
  // NEW: Calendar Module
  "/js/calendar.js", // We will create this file
  // ---
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "/images/logo-brand.png", // Added logo to cache
  // External Libraries (Consider caching locally if needed)
  "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
];

// Install Event: Cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache:", CACHE_NAME);
      // Use addAll - it fetches and caches in a single step.
      // Important: If any file fails to fetch, addAll rejects, and install fails.
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache initial assets:", error);
        // Decide if you want install to fail or proceed partially
        // throw error; // Uncomment to make install fail if caching fails
      });
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
});

// Activate Event: Clean up old caches
self.addEventListener("activate", (event) => {
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
      .then(() => self.clients.claim()) // Take control of currently open clients immediately
  );
});

// Fetch Event: Serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Strategy: Cache falling back to network
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Found in cache, return it
        return response;
      }
      // Not in cache, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Optional: Cache the new response for future requests
          // Be careful caching everything, especially API calls if data changes often
          // Example: Caching only specific file types
          // if (networkResponse && networkResponse.status === 200 && event.request.url.match(/\.(css|js|png|jpg|html)$/)) {
          //   const responseToCache = networkResponse.clone();
          //   caches.open(CACHE_NAME).then((cache) => {
          //     cache.put(event.request, responseToCache);
          //   });
          // }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, try to return a fallback page (e.g., offline.html or index.html)
          // Ensure '/index.html' is properly cached during install
          console.log("Network request failed, serving fallback.");
          return caches.match("/index.html");
        });
    })
  );
});

// --- NEW: Push Event Listener ---
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Received.");
  let data = {};
  if (event.data) {
    try {
      data = event.data.json(); // Assuming server sends JSON
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
    icon: "/images/icon-192x192.png", // Path to notification icon
    badge: "/images/icon-192x192.png", // Path to badge icon (Android)
    // You can add more options: image, actions, data, etc.
    data: data.url || { url: "/" }, // Store URL to open on click
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// --- NEW: Notification Click Event Listener ---
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close(); // Close the notification

  // Get the URL from notification data or default to '/'
  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      // If a window is already open, focus it
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === urlToOpen ? (windowClient.focus(), true) : false
      );

      // Otherwise, open a new window
      if (!hadWindowToFocus)
        clients
          .openWindow(urlToOpen)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});
