// js/app.js - Significant updates marked

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  const themeSwitcher = document.getElementById("theme-switcher");
  const enableNotificationsBtn = document.getElementById(
    "enableNotificationsBtn"
  ); // NEW
  let deferredPrompt;

  // --- Tip of the Day Data ---
  const tipData = [
    // ... (tipData remains the same) ...
    "Always get at least 3 quotes from different contractors before starting any major work.",
    "Using CPVC pipes for hot water lines is essential, as standard PVC can warp.",
    "For foundation, use a concrete mix ratio of 1:2:4 (Cement:Sand:Aggregate) for strong results.",
    "Invest in good quality electrical wiring (like Finolex or Havells) to prevent future hazards.",
    "Waterproofing your bathrooms and roof during construction can save you from major repair costs later.",
    "When painting, a good quality primer is just as important as the paint itself for a lasting finish.",
    "Vitrified tiles are more durable and have lower water absorption than ceramic tiles, making them great for floors.",
    "Plan your electrical plug points carefully in every room. You can never have too many!",
    "Teak wood is the best choice for main doors due to its durability and weather resistance.",
    "Ensure proper curing (watering the concrete) for at least 7-10 days to achieve maximum strength.",
    "Don't skip soil testing for your plot. It determines the right type of foundation for your building.",
    "LED lighting consumes up to 80% less energy than traditional bulbs. Plan for LEDs from the start.",
    "A 10% 'contingency fund' in your budget is crucial for unexpected costs that *always* come up.",
    "Check for proper sloping in bathrooms and balconies to ensure water drains correctly.",
    "UPVC windows offer excellent sound insulation and are low maintenance compared to wooden windows.",
  ];

  // --- localStorage Database Helper ---
  const db = {
    // ... (db object remains the same) ...
    getProjects: () => {
      return JSON.parse(localStorage.getItem("dreamhome_projects") || "[]");
    },
    saveProjects: (projects) => {
      localStorage.setItem("dreamhome_projects", JSON.stringify(projects));
    },
    addProject: (projectData) => {
      const projects = db.getProjects();
      projects.push(projectData);
      db.saveProjects(projects);
    },
    deleteProject: (projectId) => {
      let projects = db.getProjects();
      projects = projects.filter((p) => p.id !== projectId);
      db.saveProjects(projects);
    },
    updateProject: (projectId, updatedProjectData) => {
      let projects = db.getProjects();
      const projectIndex = projects.findIndex((p) => p.id === projectId);
      if (projectIndex !== -1) {
        projects[projectIndex] = updatedProjectData;
        db.saveProjects(projects);
      }
    },
    getProject: (projectId) => {
      const projects = db.getProjects();
      return projects.find((p) => p.id === projectId);
    },
  };

  // --- Toast Notification Function ---
  const showToast = (message, duration = 3000, action = null) => {
    // ... (showToast remains the same) ...
    const toastContainer = document.getElementById("toast-container");
    const toastMessage = document.getElementById("toast-message");

    let content = message;
    if (action) {
      content += ` <button class="btn btn-primary" id="${action.id}">${action.text}</button>`;
    }
    toastMessage.innerHTML = content;
    toastContainer.classList.add("show");

    if (action && action.handler) {
      document.getElementById(action.id).addEventListener("click", () => {
        action.handler();
        toastContainer.classList.remove("show");
      });
    }

    if (!action) {
      setTimeout(() => {
        toastContainer.classList.remove("show");
      }, duration);
    }
  };

  // --- PWA Installation Logic ---
  window.addEventListener("beforeinstallprompt", (e) => {
    // ... (remains the same) ...
    e.preventDefault();
    deferredPrompt = e;
    console.log("`beforeinstallprompt` event was fired.");
  });

  const showInstallPrompt = () => {
    // ... (remains the same) ...
    if (!deferredPrompt) {
      console.log("Install prompt not available");
      return;
    }

    const installAction = {
      id: "installBtn",
      text: "Install App",
      handler: async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
      },
    };

    showToast("Get our app for offline access!", null, installAction);
  };

  // --- Theme Switcher Logic ---
  // ... (remains the same) ...
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  themeSwitcher.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });

  // --- Unified Share Function ---
  async function shareResults() {
    // ... (remains the same) ...
    const resultsCard = document.getElementById("results-card");
    if (!resultsCard) return;

    const progressBar = document.getElementById("progress-container");
    const progressText = progressBar.querySelector(".progress-text");
    progressBar.classList.remove("hidden");
    progressText.textContent = "Generating Image...";

    try {
      // Ensure html2canvas is loaded
      if (typeof html2canvas === "undefined") {
        console.error("html2canvas is not loaded");
        progressBar.classList.add("hidden");
        return;
      }
      const canvas = await html2canvas(resultsCard);
      canvas.toBlob(
        async (blob) => {
          if (navigator.share && blob) {
            try {
              await navigator.share({
                files: [
                  new File([blob], "dreamhome-estimate.jpg", {
                    type: "image/jpeg",
                  }),
                ],
                title: "DreamHome Construction Estimate",
                text: "Here is my estimated budget from DreamHome Calculator.",
              });
            } catch (error) {
              if (error.name !== "AbortError") {
                console.error("Sharing failed:", error);
              } else {
                console.log("Sharing aborted by user.");
              }
            }
          } else if (blob) {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "dreamhome-estimate.jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
          } else {
            console.error("Failed to generate blob for sharing/download.");
          }
          progressBar.classList.add("hidden");
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Error generating image:", error);
      progressBar.classList.add("hidden");
    }
  }

  // --- Tip of the Day Logic ---
  function showTipOfTheDay() {
    // ... (remains the same) ...
    const tipContainer = document.getElementById("tip-of-the-day-container");
    if (!tipContainer) return;

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const tipIndex = dayOfYear % tipData.length;
    const tip = tipData[tipIndex];

    tipContainer.innerHTML = `
      <div class="tip-card">
        <div class="tip-card-header">
          <span class="material-symbols-outlined">lightbulb</span>
          <h3>Tip of the Day</h3>
        </div>
        <p class="tip-card-body">${tip}</p>
      </div>
    `;
  }

  // --- NEW: Notification Permission Logic ---
  function askNotificationPermission() {
    // Check if Notification API is supported
    if (!("Notification" in window)) {
      showToast("This browser does not support notifications.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showToast("Notifications enabled!");
        // Optional: Send subscription to your backend server here
        // subscribeUserToPush();
        updateNotificationButtonState();
      } else if (permission === "denied") {
        showToast(
          "Notifications blocked. Please enable them in browser settings if you change your mind.",
          5000
        );
        updateNotificationButtonState();
      } else {
        showToast("Notification permission dismissed.");
        updateNotificationButtonState();
      }
    });
  }

  // --- NEW: Update Notification Button Visual State ---
  function updateNotificationButtonState() {
    if (!("Notification" in window)) {
      enableNotificationsBtn.style.display = "none"; // Hide if not supported
      return;
    }

    if (Notification.permission === "granted") {
      enableNotificationsBtn.style.color = "var(--success-color)"; // Green color for granted
      enableNotificationsBtn.title = "Notifications Enabled";
      enableNotificationsBtn.disabled = true; // Disable if already granted
    } else if (Notification.permission === "denied") {
      enableNotificationsBtn.style.color = "#ef4444"; // Red color for denied
      enableNotificationsBtn.title = "Notifications Blocked";
      enableNotificationsBtn.disabled = true; // Disable if denied
    } else {
      enableNotificationsBtn.style.color = "var(--muted-light)"; // Default color
      enableNotificationsBtn.title = "Enable Notifications";
      enableNotificationsBtn.disabled = false; // Enable if default
    }
  }

  // --- NEW: Add listener to notification button ---
  enableNotificationsBtn.addEventListener("click", askNotificationPermission);

  // --- (Optional) Example: Subscribe user to push (requires VAPID keys & backend) ---
  /*
   async function subscribeUserToPush() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY') // Replace with your key
    });
    console.log('Push subscription:', JSON.stringify(subscription));
    // TODO: Send this subscription object to your backend server
   }

   function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
   }
   */
  // --- End Push Subscription Example ---

  // --- Main App Object ---
  const app = {
    templates: {
      home: `
        <div class="hero-section">
          <p>Your Dream Home, Budgeted Perfectly.
          Stop guessing, start planning
    </p>
        </div>
        <div id="tip-of-the-day-container"></div>
        <div class="calculator-grid">
            <a class="category-card calculator-link" href="#" data-page="houseConstruction">
                <div class="icon-wrapper"><span class="material-symbols-outlined">home</span></div>
                <p>House Construction</p>
            </a>
            <a class="category-card calculator-link" href="#" data-page="electrical">
                <div class="icon-wrapper"><span class="material-symbols-outlined">electrical_services</span></div>
                <p>Electrical</p>
            </a>
            <a class="category-card calculator-link" href="#" data-page="plumbing">
                <div class="icon-wrapper"><span class="material-symbols-outlined">plumbing</span></div>
                <p>Plumbing</p>
            </a>
            <a class="category-card calculator-link" href="#" data-page="flooring">
                <div class="icon-wrapper"><span class="material-symbols-outlined">square_foot</span></div>
                <p>Flooring</p>
            </a>
            <a class="category-card calculator-link" href="#" data-page="painting">
                <div class="icon-wrapper"><span class="material-symbols-outlined">format_paint</span></div>
                <p>Painting</p>
            </a>
            <a class="category-card calculator-link" href="#" data-page="doorsAndWindows">
                <div class="icon-wrapper"><span class="material-symbols-outlined">door_front</span></div>
                <p>Doors & Windows</p>
            </a>
        </div>`,
    },

    // UPDATED: Added 'calendar'
    calculatorPages: [
      "houseConstruction",
      "painting",
      "electrical",
      "plumbing",
      "flooring",
      "doorsAndWindows",
      "projects",
      "calendar", // Added calendar here
    ],
    staticPages: ["about", "faq", "privacy", "terms"],

    // UPDATED: LoadView handles calendar
    loadView: async function (pageName) {
      appContainer.style.opacity = "0.5";

      try {
        if (pageName === "home") {
          appContainer.innerHTML = this.templates.home;
          showTipOfTheDay();
          this.updateNav(pageName);
        } else if (this.calculatorPages.includes(pageName)) {
          // Determine path based on page name
          const modulePath =
            pageName === "calendar"
              ? `./${pageName}.js`
              : `./calculators/${pageName}.js`;
          const module = await import(modulePath);

          appContainer.innerHTML = module.template;
          // Pass correct arguments based on module type
          if (pageName === "calendar") {
            module.init(db, showToast); // Calendar init expects db, showToast
          } else {
            module.init(db, showToast, shareResults, showInstallPrompt); // Calculators expect more args
          }
          this.updateNav(pageName);
        } else if (this.staticPages.includes(pageName)) {
          const response = await fetch(`./${pageName}.html`);
          if (!response.ok) throw new Error(`Page not found: ${pageName}.html`);
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const mainContent = doc.querySelector("main");
          if (mainContent) {
            appContainer.innerHTML = mainContent.innerHTML;
          } else {
            appContainer.innerHTML =
              "<p>Error: Could not load page content.</p>";
            console.error(`Could not find <main> element in ${pageName}.html`);
          }
          this.updateNav(pageName);
        } else {
          console.error(`Unknown page requested: ${pageName}`);
          appContainer.innerHTML = this.templates.home;
          showTipOfTheDay();
          this.updateNav("home");
        }
        window.scrollTo(0, 0);
        updateNotificationButtonState(); // NEW: Update button state on every page load
      } catch (err) {
        console.error("Failed to load page: ", pageName, err);
        appContainer.innerHTML = this.templates.home;
        showTipOfTheDay();
        this.updateNav("home");
        showToast("Error loading page.", 5000);
        updateNotificationButtonState(); // NEW: Update button state even on error
      } finally {
        appContainer.style.opacity = "1";
      }
    },

    updateNav: function (pageName) {
      // ... (remains the same) ...
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === pageName);
      });
    },

    init: function () {
      // ... (remains the same) ...
      document.body.addEventListener("click", (e) => {
        const navLink = e.target.closest(".nav-btn, .calculator-link");
        if (navLink && navLink.dataset.page) {
          e.preventDefault();
          this.loadView(navLink.dataset.page);
        }
      });
      // Initial load
      this.loadView("home");
      updateNotificationButtonState(); // NEW: Set initial button state
    },
  };

  app.init();
});
