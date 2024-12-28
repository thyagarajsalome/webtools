// Add this to header.js
document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menuIcon");
  const navMenu = document.getElementById("navMenu");

  menuIcon.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.closest("nav")) {
      navMenu.classList.remove("active");
    }
  });

  // Close menu when clicking a link
  const navLinks = navMenu.getElementsByTagName("a");
  for (let link of navLinks) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
    });
  }
});
