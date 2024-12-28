// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");
const themeText = themeToggle.querySelector(".theme-text");

// Check for saved theme preference, otherwise use system preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const savedTheme = localStorage.getItem("theme");

function setTheme(isDark) {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
  themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Set initial theme
if (savedTheme) {
  setTheme(savedTheme === "dark");
} else {
  setTheme(prefersDark.matches);
}

// Listen for theme toggle button clicks
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  setTheme(!isDark);
});

// Listen for system theme changes
prefersDark.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    setTheme(e.matches);
  }
});
