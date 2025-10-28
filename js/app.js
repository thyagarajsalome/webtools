// js/app.js - Correction in loadView for calendar path

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  const themeSwitcher = document.getElementById("theme-switcher");
  const enableNotificationsBtn = document.getElementById(
    "enableNotificationsBtn"
  );
  let deferredPrompt;

  // --- Tip of the Day Data ---
  const tipData = [
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
    getProjects: () =>
      JSON.parse(localStorage.getItem("dreamhome_projects") || "[]"),
    saveProjects: (projects) =>
      localStorage.setItem("dreamhome_projects", JSON.stringify(projects)),
    addProject: (projectData) => {
      const projects = db.getProjects();
      projects.push(projectData);
      db.saveProjects(projects);
    },
    deleteProject: (projectId) => {
      let projects = db.getProjects().filter((p) => p.id !== projectId);
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
    getProject: (projectId) => db.getProjects().find((p) => p.id === projectId),
  };

  // --- Toast Notification Function ---
  const showToast = (message, duration = 3000, action = null) => {
    const toastContainer = document.getElementById("toast-container");
    const toastMessage = document.getElementById("toast-message");
    let content = message;
    if (action) {
      content += ` <button class="btn btn-primary" id="${action.id}">${action.text}</button>`;
    }
    toastMessage.innerHTML = content;
    toastContainer.classList.add("show");
    if (action?.handler) {
      document.getElementById(action.id)?.addEventListener("click", () => {
        action.handler();
        toastContainer.classList.remove("show");
      });
    }
    if (!action) {
      setTimeout(() => toastContainer.classList.remove("show"), duration);
    }
  };

  // --- PWA Installation Logic ---
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log("`beforeinstallprompt` event was fired.");
  });

  const showInstallPrompt = () => {
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
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme)
    document.documentElement.setAttribute("data-theme", currentTheme);

  themeSwitcher?.addEventListener("click", () => {
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
    const resultsCard = document.getElementById("results-card");
    if (!resultsCard) return;
    const progressBar = document.getElementById("progress-container");
    const progressText = progressBar?.querySelector(".progress-text");
    progressBar?.classList.remove("hidden");
    if (progressText) progressText.textContent = "Generating Image...";

    try {
      if (typeof html2canvas === "undefined")
        throw new Error("html2canvas is not loaded");
      const canvas = await html2canvas(resultsCard);
      canvas.toBlob(
        async (blob) => {
          if (!blob) throw new Error("Failed to generate blob.");
          if (navigator.share) {
            try {
              await navigator.share({
                files: [
                  new File([blob], "dreamhome-estimate.jpg", {
                    type: "image/jpeg",
                  }),
                ],
                title: "DreamHome Construction Estimate",
                text: "Here's my estimated budget from DreamHome Calculator.",
              });
            } catch (error) {
              if (error.name !== "AbortError")
                console.error("Sharing failed:", error);
              else console.log("Sharing aborted.");
            }
          } else {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "dreamhome-estimate.jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
          }
          progressBar?.classList.add("hidden");
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Error generating/sharing image:", error);
      showToast("Could not generate image for sharing.", 4000);
      progressBar?.classList.add("hidden");
    }
  }

  // --- Tip of the Day Logic ---
  function showTipOfTheDay() {
    const tipContainer = document.getElementById("tip-of-the-day-container");
    if (!tipContainer) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const tip = tipData[dayOfYear % tipData.length];
    tipContainer.innerHTML = `
      <div class="tip-card">
        <div class="tip-card-header"><span class="material-symbols-outlined">lightbulb</span><h3>Tip of the Day</h3></div>
        <p class="tip-card-body">${tip}</p>
      </div>`;
  }

  // --- Notification Permission Logic ---
  function askNotificationPermission() {
    if (!("Notification" in window)) {
      showToast("This browser does not support notifications.");
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") showToast("Notifications enabled!");
      else if (permission === "denied")
        showToast("Notifications blocked. Enable in browser settings?", 5000);
      else showToast("Notification permission dismissed.");
      updateNotificationButtonState();
    });
  }

  function updateNotificationButtonState() {
    if (!enableNotificationsBtn) return; // Guard clause
    if (!("Notification" in window)) {
      enableNotificationsBtn.style.display = "none";
      return;
    }
    const permission = Notification.permission;
    enableNotificationsBtn.disabled =
      permission === "granted" || permission === "denied";
    enableNotificationsBtn.title =
      permission === "granted"
        ? "Notifications Enabled"
        : permission === "denied"
        ? "Notifications Blocked"
        : "Enable Notifications";
    enableNotificationsBtn.style.color =
      permission === "granted"
        ? "var(--success-color)"
        : permission === "denied"
        ? "#ef4444"
        : "var(--muted-light)";
  }

  enableNotificationsBtn?.addEventListener("click", askNotificationPermission);

  // --- Main App Object ---
  const app = {
    templates: { home: `...` }, // Home template remains the same
    calculatorPages: [
      "houseConstruction",
      "painting",
      "electrical",
      "plumbing",
      "flooring",
      "doorsAndWindows",
      "projects",
      "calendar",
    ],
    staticPages: ["about", "faq", "privacy", "terms"],

    // load-view
    loadView: async function (pageName) {
      appContainer.style.opacity = "0.5";
      try {
        if (pageName === "home") {
          appContainer.innerHTML = this.templates.home; // Ensure home template is defined
          if (this.templates.home) showTipOfTheDay(); // Check if home template exists before calling
          this.updateNav(pageName);
        } else if (this.calculatorPages.includes(pageName)) {
          // *** VERIFY THIS PART CAREFULLY ***
          // Correctly determine the path: calendar.js is in /js/, others are in /js/calculators/
          const modulePath =
            pageName === "calendar"
              ? `./${pageName}.js` // Should resolve to ./calendar.js
              : `./calculators/${pageName}.js`; // Should resolve to ./calculators/someCalc.js
          // ***************************

          const module = await import(modulePath); // Ensure this line uses modulePath
          if (
            !module ||
            !module.template ||
            typeof module.init !== "function"
          ) {
            throw new Error(
              `Module ${pageName} did not load correctly or is missing exports.`
            );
          }
          appContainer.innerHTML = module.template;

          // Pass correct arguments based on module type
          if (pageName === "calendar") {
            module.init(db, showToast); // Calendar init expects db, showToast
          } else {
            // Calculators expect more args
            module.init(db, showToast, shareResults, showInstallPrompt);
          }
          this.updateNav(pageName);
        } else if (this.staticPages.includes(pageName)) {
          // This block should NOT run for 'calendar' if the above logic is correct
          const response = await fetch(`./${pageName}.html`);
          // ... rest of static page loading ...
          this.updateNav(pageName);
        } else {
          throw new Error(`Unknown page requested: ${pageName}`);
        }
        window.scrollTo(0, 0);
        updateNotificationButtonState();
      } catch (err) {
        console.error("Failed to load page:", pageName, err);
        appContainer.innerHTML = this.templates.home;
        if (this.templates.home) showTipOfTheDay();
        this.updateNav("home");
        showToast(`Error loading page: ${pageName}.`, 5000);
        updateNotificationButtonState();
      } finally {
        appContainer.style.opacity = "1";
      }
    },
    // load-view-end
    updateNav: function (pageName) {
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === pageName);
      });
    },

    init: function () {
      this.templates.home = `
        <div class="hero-section">
          <p>Your Dream Home, Budgeted Perfectly.</p>
          <p><span>Stop guessing, start planning</span>. DreamHome Calculator provides transparent estimates.</p>
        </div>
        <div id="tip-of-the-day-container"></div>
        <div class="calculator-grid">
            ${this.calculatorPages
              .filter((p) => p !== "projects" && p !== "calendar")
              .map(
                (page) => `
            <a class="category-card calculator-link" href="#" data-page="${page}">
                <div class="icon-wrapper"><span class="material-symbols-outlined">${getIconForPage(
                  page
                )}</span></div>
                <p>${getPageTitle(page)}</p>
            </a>`
              )
              .join("")}
        </div>`; // Dynamically generate home grid if needed, or keep static HTML

      document.body.addEventListener("click", (e) => {
        const navLink = e.target.closest(".nav-btn, .calculator-link");
        if (navLink?.dataset.page) {
          e.preventDefault();
          this.loadView(navLink.dataset.page);
        }
      });
      this.loadView("home"); // Initial load
      updateNotificationButtonState(); // Set initial button state
    },
  };

  // Helper functions for dynamic home grid (optional)
  function getIconForPage(pageName) {
    const icons = {
      houseConstruction: "home",
      electrical: "electrical_services",
      plumbing: "plumbing",
      flooring: "square_foot",
      painting: "format_paint",
      doorsAndWindows: "door_front",
    };
    return icons[pageName] || "calculate";
  }
  function getPageTitle(pageName) {
    const titles = {
      houseConstruction: "House Construction",
      electrical: "Electrical",
      plumbing: "Plumbing",
      flooring: "Flooring",
      painting: "Painting",
      doorsAndWindows: "Doors & Windows",
    };
    // Simple camelCase to Title Case conversion as fallback
    return (
      titles[pageName] ||
      pageName
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
    );
  }

  app.init();
});
