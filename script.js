// Master Tool websites hub
const categories = [
  { name: "House", color: "#FF6B6B", icon: "home" },
  { name: "Floor & Wall Tile", color: "#4ECDC4", icon: "grid" },
  { name: "Paint", color: "#45B7D1", icon: "paint-roller" },
  { name: "Plumbing", color: "#FFA07A", icon: "thermometer" },
  { name: "Electrical", color: "#98D8C8", icon: "zap" },
  { name: "Fittings", color: "#F7DC6F", icon: "tool" },
  { name: "Windows", color: "#AED6F1", icon: "maximize-2" },
  { name: "Doors", color: "#F1948A", icon: "log-in" },
  { name: "Interior", color: "#D7BDE2", icon: "layout" },
];

const categoryList = document.getElementById("categories");
const gallery = document.getElementById("gallery");

// Custom paint roller icon SVG
const paintRollerSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="custom-icon">
          <path d="M4 5h16v5H4z"/>
          <path d="M19 5V3c0-.6-.4-1-1-1H6c-.6 0-1 .4-1 1v2"/>
          <path d="M4 10v7c0 1.1.9 2 2 2h2"/>
          <path d="M18 19h2c1.1 0 2-.9 2-2v-7"/>
      </svg>
  `;

// Populate categories
categories.forEach((category) => {
  const span = document.createElement("span");
  span.className = "category-item";
  span.textContent = category.name;
  span.dataset.category = category.name
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-");
  span.style.backgroundColor = category.color;
  span.style.color = "#fff";
  categoryList.appendChild(span);
});

// Populate gallery
categories.forEach((category) => {
  const item = document.createElement("div");
  item.className = "gallery-item";
  item.dataset.category = category.name
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-");

  if (category.icon === "paint-roller") {
    item.innerHTML = paintRollerSvg;
  } else {
    const icon = document.createElement("i");
    icon.setAttribute("data-feather", category.icon);
    item.appendChild(icon);
  }

  const text = document.createElement("span");
  text.textContent = category.name;

  item.appendChild(text);
  gallery.appendChild(item);
});

// Initialize Feather icons
if (typeof feather !== "undefined") {
  feather.replace();
} else {
  console.error("Feather icons library not loaded");
}

// Add interactivity
categoryList.addEventListener("click", (e) => {
  if (e.target.classList.contains("category-item")) {
    const clickedCategory = e.target.dataset.category;
    const color = e.target.style.backgroundColor;

    // Reset all gallery items
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.style.backgroundColor = "";
      item.style.color = "";
      item.classList.remove("active");
    });

    // Highlight the clicked category's gallery item
    const galleryItem = document.querySelector(
      `.gallery-item[data-category="${clickedCategory}"]`
    );
    if (galleryItem) {
      galleryItem.style.backgroundColor = color;
      galleryItem.style.color = "#fff";
      galleryItem.classList.add("active");
    }
  }
});

// gallery.addEventListener("click", (e) => {
//   const galleryItem = e.target.closest(".gallery-item");
//   if (galleryItem) {
//     const category = galleryItem.textContent.trim();
//     alert(
//       `You clicked on ${category}. This would typically open a detailed estimation page for ${category}.`
//     );
//   }
// });

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});




