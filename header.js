document.getElementById("menuIcon").addEventListener("click", function () {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("active");
});

// Add animation delay to menu items
const menuItems = document.querySelectorAll("#navMenu li");
menuItems.forEach((item, index) => {
  item.style.setProperty("--i", index);
});
