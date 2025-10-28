document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  const themeSwitcher = document.getElementById("theme-switcher");
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
    // ... (shareResults function remains unchanged) ...
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
        // Optionally load it dynamically here if needed
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
              // Handle share errors, e.g., user cancelled
              if (error.name !== "AbortError") {
                console.error("Sharing failed:", error);
              } else {
                console.log("Sharing aborted by user.");
              }
            }
          } else if (blob) {
            // Fallback for browsers that don't support navigator.share with files
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "dreamhome-estimate.jpg";
            document.body.appendChild(a); // Append link to body for Firefox compatibility
            a.click();
            document.body.removeChild(a); // Clean up
            URL.revokeObjectURL(a.href); // Clean up blob URL
          } else {
            console.error("Failed to generate blob for sharing/download.");
          }
          progressBar.classList.add("hidden");
        },
        "image/jpeg",
        0.95
      ); // Added quality parameter
    } catch (error) {
      console.error("Error generating image:", error);
      progressBar.classList.add("hidden");
    }
  }

  // --- Tip of the Day Logic ---
  function showTipOfTheDay() {
    // ... (showTipOfTheDay function remains unchanged) ...
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

  // --- Main App Object ---
  const app = {
    templates: {
      home: `
        <div class="hero-section">
          <p>Your Dream Home, Budgeted Perfectly.</p>
          <p>
            <span>Stop guessing, start planning</span>. "Dream Home Calculator"
            provides transparent, detailed cost estimates for every stage of your
            home construction project.
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

    // List of dynamic calculator pages
    calculatorPages: [
      "houseConstruction",
      "painting",
      "electrical",
      "plumbing",
      "flooring",
      "doorsAndWindows",
      "projects",
    ],
    // NEW: Explicit list of static pages
    staticPages: ["about", "faq", "privacy", "terms"],

    // Dynamic View Loader
    loadView: async function (pageName) {
      // Add loading indicator start here if desired
      appContainer.style.opacity = "0.5"; // Example: dim content while loading

      try {
        if (pageName === "home") {
          appContainer.innerHTML = this.templates.home;
          showTipOfTheDay();
          this.updateNav(pageName);
        } else if (this.calculatorPages.includes(pageName)) {
          const calculatorModule = await import(
            // Ensure the path starts correctly from the root or relative path
            `./calculators/${pageName}.js`
            // If app.js is in /js/, and calculators are in /js/calculators/, this is correct.
            // If your server setup is different, adjust the path (e.g., `/js/calculators/${pageName}.js`)
          );
          appContainer.innerHTML = calculatorModule.template;
          calculatorModule.init(db, showToast, shareResults, showInstallPrompt);
          this.updateNav(pageName);
        } else if (this.staticPages.includes(pageName)) {
          // UPDATED: Check against staticPages list
          // Fallback for static pages
          const response = await fetch(`./${pageName}.html`); // Ensure this path is correct relative to index.html
          if (!response.ok) throw new Error(`Page not found: ${pageName}.html`);
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const mainContent = doc.querySelector("main"); // Get the <main> element
          if (mainContent) {
            appContainer.innerHTML = mainContent.innerHTML; // Inject its content
          } else {
            appContainer.innerHTML =
              "<p>Error: Could not load page content.</p>"; // Fallback error
            console.error(`Could not find <main> element in ${pageName}.html`);
          }
          this.updateNav(pageName);
        } else {
          // Handle unknown page names gracefully
          console.error(`Unknown page requested: ${pageName}`);
          appContainer.innerHTML = this.templates.home; // Go home
          showTipOfTheDay();
          this.updateNav("home");
        }
        // Scroll to top on new page load
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Failed to load page: ", pageName, err);
        // On failure, navigate back home
        appContainer.innerHTML = this.templates.home;
        showTipOfTheDay();
        this.updateNav("home");
        showToast("Error loading page.", 5000); // Show error to user
      } finally {
        // Remove loading indicator
        appContainer.style.opacity = "1";
      }
    },

    updateNav: function (pageName) {
      // ... (updateNav function remains unchanged) ...
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === pageName);
      });
    },

    init: function () {
      // UPDATED: Removed setTimeout from event listener
      document.body.addEventListener("click", (e) => {
        const navLink = e.target.closest(".nav-btn, .calculator-link");
        if (navLink && navLink.dataset.page) {
          e.preventDefault(); // Prevent default anchor behavior
          this.loadView(navLink.dataset.page); // Load view immediately
        }
      });
      // Initial load
      this.loadView("home");
    },
  };

  app.init();
});
