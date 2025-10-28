// js/calendar.js - Basic Calendar Module

export const template = `
<div class="calendar-view">
  <div class="calendar-header">
    <button id="prevMonthBtn" class="btn btn-secondary">&lt;</button>
    <h2 id="currentMonthYear">Month Year</h2>
    <button id="nextMonthBtn" class="btn btn-secondary">&gt;</button>
  </div>
  <div class="calendar-grid">
    <div class="calendar-day-header">Sun</div>
    <div class="calendar-day-header">Mon</div>
    <div class="calendar-day-header">Tue</div>
    <div class="calendar-day-header">Wed</div>
    <div class="calendar-day-header">Thu</div>
    <div class="calendar-day-header">Fri</div>
    <div class="calendar-day-header">Sat</div>
    </div>
  <div class="calendar-events">
      <h3>Events / Notes for <span id="selectedDate"></span></h3>
      <div id="eventList">No date selected.</div>
      <form id="add-note-form" class="add-item-form hidden">
          <input type="text" id="note-text" placeholder="Add a note for this date" required>
          <button type="submit" class="btn btn-primary">Save Note</button>
      </form>
  </div>
</div>
`;

export const init = function (db, showToast) {
  // Removed unused params
  const monthYearElement = document.getElementById("currentMonthYear");
  const gridElement = document.querySelector(".calendar-grid");
  const selectedDateElement = document.getElementById("selectedDate");
  const eventListElement = document.getElementById("eventList");
  const addNoteForm = document.getElementById("add-note-form");
  const noteTextInput = document.getElementById("note-text");

  let currentDate = new Date();
  let selectedDayElement = null;
  let currentNotes = loadNotes(); // Load notes from localStorage

  function loadNotes() {
    return JSON.parse(localStorage.getItem("calendar_notes") || "{}");
  }

  function saveNotes() {
    localStorage.setItem("calendar_notes", JSON.stringify(currentNotes));
  }

  function renderCalendar(date) {
    gridElement.innerHTML = `
      <div class="calendar-day-header">Sun</div>
      <div class="calendar-day-header">Mon</div>
      <div class="calendar-day-header">Tue</div>
      <div class="calendar-day-header">Wed</div>
      <div class="calendar-day-header">Thu</div>
      <div class="calendar-day-header">Fri</div>
      <div class="calendar-day-header">Sat</div>
    `; // Reset grid headers

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed

    monthYearElement.textContent = date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("calendar-day", "empty");
      gridElement.appendChild(emptyCell);
    }

    // Add cells for each day
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("calendar-day");
      dayCell.textContent = day;
      dayCell.dataset.date = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`; // YYYY-MM-DD

      // Highlight today
      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        dayCell.classList.add("today");
      }
      // Add indicator if there's a note
      if (currentNotes[dayCell.dataset.date]) {
        dayCell.classList.add("has-note");
      }

      dayCell.addEventListener("click", handleDayClick);
      gridElement.appendChild(dayCell);
    }
  }

  function handleDayClick(event) {
    const target = event.target;
    if (
      !target.classList.contains("calendar-day") ||
      target.classList.contains("empty")
    ) {
      return;
    }
    const dateStr = target.dataset.date;
    selectedDateElement.textContent = new Date(
      dateStr + "T00:00:00"
    ).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Remove selection from previous day
    if (selectedDayElement) {
      selectedDayElement.classList.remove("selected");
    }
    // Add selection to current day
    target.classList.add("selected");
    selectedDayElement = target;

    displayNotesForDate(dateStr);
    addNoteForm.classList.remove("hidden"); // Show the form
    addNoteForm.dataset.date = dateStr; // Store date on form
    noteTextInput.value = ""; // Clear input
  }

  function displayNotesForDate(dateStr) {
    const notes = currentNotes[dateStr] || [];
    if (notes.length > 0) {
      eventListElement.innerHTML = notes
        .map(
          (note, index) => `
            <div class="note-item" data-index="${index}">
                <span>${note}</span>
                <button class="btn-delete-item btn-delete-note">&times;</button>
            </div>
        `
        )
        .join("");
    } else {
      eventListElement.innerHTML =
        '<p class="empty-list-text">No notes for this date.</p>';
    }
  }

  document.getElementById("prevMonthBtn").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
    resetSelection();
  });

  document.getElementById("nextMonthBtn").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
    resetSelection();
  });

  function resetSelection() {
    selectedDateElement.textContent = "";
    eventListElement.innerHTML = "No date selected.";
    addNoteForm.classList.add("hidden");
    if (selectedDayElement) {
      selectedDayElement.classList.remove("selected");
      selectedDayElement = null;
    }
  }

  // Handle adding a new note
  addNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dateStr = addNoteForm.dataset.date;
    const noteText = noteTextInput.value.trim();
    if (!dateStr || !noteText) return;

    if (!currentNotes[dateStr]) {
      currentNotes[dateStr] = [];
    }
    currentNotes[dateStr].push(noteText);
    saveNotes();
    displayNotesForDate(dateStr); // Refresh notes display
    noteTextInput.value = ""; // Clear input

    // Update day cell indicator
    const dayCell = gridElement.querySelector(
      `.calendar-day[data-date="${dateStr}"]`
    );
    if (dayCell) {
      dayCell.classList.add("has-note");
    }
  });

  // Handle deleting a note (using event delegation)
  eventListElement.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".btn-delete-note");
    if (deleteBtn) {
      const noteItem = deleteBtn.closest(".note-item");
      const dateStr = addNoteForm.dataset.date; // Get date from form
      const index = parseInt(noteItem.dataset.index, 10);

      if (
        dateStr &&
        currentNotes[dateStr] &&
        index >= 0 &&
        index < currentNotes[dateStr].length
      ) {
        currentNotes[dateStr].splice(index, 1); // Remove note from array
        if (currentNotes[dateStr].length === 0) {
          delete currentNotes[dateStr]; // Clean up if no notes left
          // Update day cell indicator
          const dayCell = gridElement.querySelector(
            `.calendar-day[data-date="${dateStr}"]`
          );
          if (dayCell) {
            dayCell.classList.remove("has-note");
          }
        }
        saveNotes();
        displayNotesForDate(dateStr); // Refresh display
      }
    }
  });

  // Initial render
  renderCalendar(currentDate);
};
