// Color configuration
const colors = {
  // Existing colors
  "color-1": "#d5d265",
  "color-2": "#b73352",
  "color-3": "#4a59a6",
  "color-4": "#178b7e",
  "color-5": "#e6ad5d",
  "color-6": "#6bbec1",
  "color-7": "#c66363",
  "color-8": "#b073df",
  "color-9": "#88a765",
  "color-10": "#709abf",

  // New colors
  "color-11": "#FF9933", // Marigold Glory
  "color-12": "#9B4B4B", // Terracotta Touch
  "color-13": "#006B3C", // Emerald Vista
  "color-14": "#D4AF37", // Royal Gold
  "color-15": "#800080", // Mystic Purple
  "color-16": "#C5B358", // Desert Sand
  "color-17": "#2E8B57", // Monsoon Green
  "color-18": "#CD5C5C", // Brick Red
  "color-19": "#4B0082", // Royal Indigo
  "color-20": "#8B4513", // Spice Brown
};

let currentColor = null;

// DOM Elements
const colorButtons = document.querySelectorAll(".color-button");
const colorOverlays = document.querySelectorAll(".color-overlay");
const resetButton = document.getElementById("resetButton");
const selectedColorText = document.getElementById("selectedColorText");

// Handle color selection
function selectColor(colorId) {
  // Reset all overlays and buttons
  colorOverlays.forEach((overlay) => {
    overlay.style.opacity = "0";
  });

  colorButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // If selecting a new color
  if (colorId && colorId !== currentColor) {
    const overlay = document.getElementById(`${colorId}-overlay`);
    const button = document.querySelector(`[data-color="${colorId}"]`);

    overlay.style.opacity = "1";
    button.classList.add("active");
    selectedColorText.innerHTML = `Selected Color: <span class="selected-color-id">${colors[colorId]}</span>`;
    currentColor = colorId;
  } else {
    // If clicking the same color or resetting
    selectedColorText.textContent = "";
    currentColor = null;
  }
}

// Event Listeners
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const colorId = button.dataset.color;
    if (currentColor === colorId) {
      selectColor(null); // Deselect if clicking the same color
    } else {
      selectColor(colorId);
    }
  });
});

resetButton.addEventListener("click", () => {
  selectColor(null);
});
