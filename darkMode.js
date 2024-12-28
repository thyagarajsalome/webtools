// Theme toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  const themeText = themeToggle.querySelector(".theme-text");

  // Check for saved theme preference, otherwise use system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = localStorage.getItem("theme");

  function setTheme(isDark) {
    // Update data-theme attribute
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    // Update icon and text
    if (isDark) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      themeText.textContent = "Light Mode";
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      themeText.textContent = "Dark Mode";
    }

    // Save preference
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  // Initialize theme
  if (savedTheme) {
    setTheme(savedTheme === "dark");
  } else {
    setTheme(prefersDark.matches);
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "light");
  });

  // Listen for system theme changes
  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches);
    }
  });
});
