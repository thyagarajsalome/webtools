document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  const themeSwitcher = document.getElementById("theme-switcher");
  let deferredPrompt;

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

  // --- Unified Share Function (used by all modules) ---
  async function shareResults() {
    const resultsCard = document.getElementById("results-card");
    if (!resultsCard) return;

    const progressBar = document.getElementById("progress-container");
    const progressText = progressBar.querySelector(".progress-text");
    progressBar.classList.remove("hidden");
    progressText.textContent = "Generating Image...";

    try {
      const canvas = await html2canvas(resultsCard);
      canvas.toBlob(async (blob) => {
        if (navigator.share) {
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
            console.error("Sharing failed:", error);
          }
        } else {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "dreamhome-estimate.jpg";
          a.click();
        }
        progressBar.classList.add("hidden");
      }, "image/jpeg");
    } catch (error) {
      console.error("Error generating image:", error);
      progressBar.classList.add("hidden");
    }
  }

  // --- Main App Object ---
  const app = {
    // Keep the home template here for fast initial load
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

    // List of all dynamic calculator pages
    calculatorPages: [
      "houseConstruction",
      "painting",
      "electrical",
      "plumbing",
      "flooring",
      "doorsAndWindows",
      "projects",
    ],

    // NEW: Dynamic View Loader
    loadView: async function (pageName) {
      try {
        if (pageName === "home") {
          appContainer.innerHTML = this.templates.home;
          this.updateNav(pageName);
        } else if (this.calculatorPages.includes(pageName)) {
          // Dynamically import the calculator module
          const calculatorModule = await import(
            `./js/calculators/${pageName}.js`
          );
          appContainer.innerHTML = calculatorModule.template;
          // Run the module's init function, passing in helpers
          calculatorModule.init(db, showToast, shareResults, showInstallPrompt);
          this.updateNav(pageName);
        } else {
          // Fallback for static pages (about, faq, etc.)
          const response = await fetch(`./${pageName}.html`);
          if (!response.ok) throw new Error("Page not found");
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          appContainer.innerHTML = doc.querySelector("main").innerHTML;
          this.updateNav(pageName);
        }
      } catch (err) {
        console.error("Failed to load page: ", err);
        // On failure, navigate back home
        appContainer.innerHTML = this.templates.home;
        this.updateNav("home");
      }
    },

    updateNav: function (pageName) {
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === pageName);
      });
    },

    init: function () {
      document.body.addEventListener("click", (e) => {
        const navLink = e.target.closest(".nav-btn, .calculator-link");
        if (navLink && navLink.dataset.page) {
          e.preventDefault();
          this.loadView(navLink.dataset.page);
        }
      });
      // Initial load
      this.loadView("home");
    },
  };

  app.init();
});
