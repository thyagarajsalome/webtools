

export const template = `
<div class="calculator-header">
    <h1>Electrical Budget Calculator</h1>
    <p>Estimate the complete electrical wiring cost for your new Indian home.</p>
</div>
<form id="electricalForm">
    <div class="step-navigation">
    <button id="step-btn-1" class="step-btn active">1. Basics</button>
    <button id="step-btn-2" class="step-btn">2. Rooms</button>
    <button id="step-btn-3" class="step-btn">3. Quality</button>
    <button id="step-btn-4" class="step-btn">4. Labor</button>
    </div>
    <div id="step-1" class="step active">
    <h2>Project Details</h2>
    <div class="form-grid">
        <div><label for="houseArea">Total Built-up Area (sq.ft.)</label><input type="number" id="houseArea" placeholder="e.g., 1200" required /></div>
        <div><label for="floors">Number of Floors</label><input type="number" id="floors" placeholder="e.g., 2" value="1" required /></div>
    </div>
    </div>
    <div id="step-2" class="step">
    <h2>Room & Point Configuration</h2><p>Add each room and specify the number of electrical points.</p>
    <div id="room-container"></div>
    <div style="display: flex; align-items: center; gap: 1rem; margin-top:1rem; border-top:1px solid var(--border-color); padding-top:1rem;">
        <select id="roomType" style="flex-grow: 1;"><option value="Bedroom">Bedroom</option><option value="Living Room">Living Room / Hall</option><option value="Kitchen">Kitchen</option><option value="Bathroom">Bathroom</option><option value="Balcony">Balcony / Utility</option><option value="Staircase">Staircase / Passage</option></select>
        <button type="button" id="addRoomBtn" class="btn btn-primary">Add Room</button>
    </div>
    </div>
    <div id="step-3" class="step">
    <h2>Material Quality</h2><p>Choose the quality of materials.</p>
    <div class="quality-grid">
        <label class="quality-option"><input type="radio" name="brandPreference" value="economy" class="sr-only" checked /><h3>Economy</h3><p>e.g., Anchor Roma</p></label>
        <label class="quality-option"><input type="radio" name="brandPreference" value="mid" class="sr-only" /><h3>Mid-Range</h3><p>e.g., Havells, Polycab</p></label>
        <label class="quality-option"><input type="radio" name="brandPreference" value="premium" class="sr-only" /><h3>Premium</h3><p>e.g., Legrand, Schneider</p></label>
    </div>
    </div>
    <div id="step-4" class="step">
    <h2>Labor Cost Estimation</h2><p>Enter the labor rates prevalent in your area.</p>
    <div class="form-grid">
        <div><label for="laborPerPoint">Labor Rate per Point (₹)</label><input type="number" id="laborPerPoint" value="450" /></div>
        <div><label for="mainPanelLabor">Main Panel & Earthing Labor (₹)</label><input type="number" id="mainPanelLabor" value="5000" /></div>
    </div>
    </div>
    <div class="form-navigation">
    <button type="button" id="prevBtn" class="btn btn-secondary" disabled>Previous</button>
    <button type="button" id="nextBtn" class="btn btn-primary">Next</button>
    <button type="submit" id="submitBtn" class="btn btn-submit hidden">Calculate</button>
    </div>
</form>
<section id="results" class="hidden"></section>
`;

export const init = function (db, showToast, shareResults, showInstallPrompt) {
  let currentStep = 1,
    totalSteps = 4,
    rooms = [],
    chartInstance = null;
  const costData = {
    items: {
      lightPoint: { economy: 450, mid: 700, premium: 1500 },
      fanPoint: { economy: 2000, mid: 3500, premium: 6000 },
      socket6A: { economy: 300, mid: 500, premium: 900 },
      socket16A: { economy: 550, mid: 800, premium: 1300 },
      acPoint: { economy: 1200, mid: 1800, premium: 2500 },
      tvPoint: { economy: 400, mid: 650, premium: 1100 },
    },
    commonMaterials: {
      pipe: { economy: 8, mid: 12, premium: 20 },
      mainWire: { economy: 15, mid: 25, premium: 45 },
      db: { economy: 4, mid: 7, premium: 12 },
    },
  };
  const roomDefaults = {
    Bedroom: {
      lights: 3,
      fans: 1,
      sockets6A: 4,
      sockets16A: 1,
      acs: 1,
      tvs: 1,
    },
    "Living Room": {
      lights: 4,
      fans: 2,
      sockets6A: 5,
      sockets16A: 1,
      acs: 1,
      tvs: 1,
    },
    Kitchen: {
      lights: 2,
      fans: 0,
      sockets6A: 3,
      sockets16A: 3,
      acs: 0,
      tvs: 0,
    },
    Bathroom: {
      lights: 2,
      fans: 0,
      sockets6A: 1,
      sockets16A: 1,
      acs: 0,
      tvs: 0,
    },
    Balcony: {
      lights: 1,
      fans: 0,
      sockets6A: 1,
      sockets16A: 0,
      acs: 0,
      tvs: 0,
    },
    Staircase: {
      lights: 2,
      fans: 0,
      sockets6A: 1,
      sockets16A: 0,
      acs: 0,
      tvs: 0,
    },
  };

  function updateStepVisibility() {
    document
      .querySelectorAll(".step")
      .forEach((step, index) =>
        step.classList.toggle("active", index + 1 === currentStep)
      );
    document
      .querySelectorAll(".step-btn")
      .forEach((btn, index) =>
        btn.classList.toggle("active", index < currentStep)
      );
    document.getElementById("prevBtn").disabled = currentStep === 1;
    document
      .getElementById("nextBtn")
      .classList.toggle("hidden", currentStep === totalSteps);
    document
      .getElementById("submitBtn")
      .classList.toggle("hidden", currentStep !== totalSteps);
  }

  function addRoom() {
    const roomType = document.getElementById("roomType").value;
    const roomId = `room-${Date.now()}`;
    const defaults = roomDefaults[roomType];
    const room = { id: roomId, type: roomType, ...defaults };
    rooms.push(room);
    renderRooms();
  }

  function createInput(name, label, id, value) {
    return `<div class="input-group"><label>${label}</label><input type="number" data-room-id="${id}" data-point-type="${name}" value="${value}" min="0" style="width: 70px; text-align: center; padding: 0.5rem;"></div>`;
  }

  function renderRooms() {
    const roomContainer = document.getElementById("room-container");
    roomContainer.innerHTML = rooms
      .map(
        (room) => `
                        <div id="${room.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${room.type}</h3>
                                <button type="button" class="remove-item-btn" data-id="${
                                  room.id
                                }">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.875rem; @media (min-width: 1024px) { grid-template-columns: repeat(6, 1fr); }">
                                ${createInput(
                                  "lights",
                                  "Lights",
                                  room.id,
                                  room.lights
                                )}
                                ${createInput(
                                  "fans",
                                  "Fans",
                                  room.id,
                                  room.fans
                                )}
                                ${createInput(
                                  "sockets6A",
                                  "6A Sockets",
                                  room.id,
                                  room.sockets6A
                                )}
                                ${createInput(
                                  "sockets16A",
                                  "16A Sockets",
                                  room.id,
                                  room.sockets16A
                                )}
                                ${createInput(
                                  "acs",
                                  "AC Points",
                                  room.id,
                                  room.acs
                                )}
                                ${createInput(
                                  "tvs",
                                  "TV/Data",
                                  room.id,
                                  room.tvs
                                )}
                            </div>
                        </div>`
      )
      .join("");
  }

  function removeRoom(roomId) {
    rooms = rooms.filter((room) => room.id !== roomId);
    renderRooms();
  }

  function updateRoomData(roomId, pointType, value) {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      room[pointType] = parseInt(value, 10) || 0;
    }
  }

  function calculateBudget(e) {
    e.preventDefault();
    const houseArea =
      parseFloat(document.getElementById("houseArea").value) || 0;
    const quality = document.querySelector(
      'input[name="brandPreference"]:checked'
    ).value;
    const laborPerPoint =
      parseFloat(document.getElementById("laborPerPoint").value) || 0;
    const mainPanelLabor =
      parseFloat(document.getElementById("mainPanelLabor").value) || 0;
    const totalPoints = rooms.reduce(
      (acc, room) =>
        acc +
        room.lights +
        room.fans +
        room.sockets6A +
        room.sockets16A +
        room.acs +
        room.tvs,
      0
    );
    const pointCosts = rooms.reduce(
      (acc, room) => {
        acc.lights += room.lights * costData.items.lightPoint[quality];
        acc.fans += room.fans * costData.items.fanPoint[quality];
        acc.sockets6A += room.sockets6A * costData.items.socket6A[quality];
        acc.sockets16A += room.sockets16A * costData.items.socket16A[quality];
        acc.acs += room.acs * costData.items.acPoint[quality];
        acc.tvs += room.tvs * costData.items.tvPoint[quality];
        return acc;
      },
      {
        lights: 0,
        fans: 0,
        sockets6A: 0,
        sockets16A: 0,
        acs: 0,
        tvs: 0,
      }
    );
    const totalPointMaterialCost = Object.values(pointCosts).reduce(
      (a, b) => a + b,
      0
    );
    const commonMaterialCost =
      (costData.commonMaterials.pipe[quality] +
        costData.commonMaterials.mainWire[quality] +
        costData.commonMaterials.db[quality]) *
      houseArea;
    const totalMaterialCost = totalPointMaterialCost + commonMaterialCost;
    const totalLaborCost = totalPoints * laborPerPoint + mainPanelLabor;
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      totalPoints,
      pointCosts,
      commonMaterialCost,
      houseArea,
      // Data for saving
      inputs: {
        houseArea,
        quality,
        laborPerPoint,
        mainPanelLabor,
        rooms: [...rooms],
      },
    });
  }

  function displayResults(data) {
    const resultsSection = document.getElementById("results");
    resultsSection.innerHTML = `
                        <header class="results-header">
                            <h2>Your Estimated Budget</h2>
                            <div style="display: flex; gap: 0.5rem;">
                                <button id="saveBtn" class="btn btn-secondary">Save Project</button>
                                <button id="shareBtn" class="btn btn-primary">Share</button>
                            </div>
                        </header>
                        <div class="results-card" id="results-card">
                            <div class="results-grid">
                                <div class="chart-container"><canvas id="costChart"></canvas></div>
                                <div>
                                    <p>Total Estimated Cost</p><p id="grandTotal">₹${Math.round(
                                      data.grandTotal
                                    ).toLocaleString("en-IN")}</p>
                                    <div class="summary-details">
                                        <div class="summary-item"><span>Total Material Cost:</span><span id="totalMaterialCost">₹${Math.round(
                                          data.totalMaterialCost
                                        ).toLocaleString("en-IN")}</span></div>
                                        <div class="summary-item"><span>Total Labor Cost:</span><span id="totalLaborCost">₹${Math.round(
                                          data.totalLaborCost
                                        ).toLocaleString("en-IN")}</span></div>
                                        <div class="summary-item summary-item-total"><span>Total Electrical Points:</span><span id="totalPoints">${
                                          data.totalPoints
                                        }</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Material Breakdown</h3>
                                <div id="detailed-breakdown">
                                    <div class="summary-item"><span>Light Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.lights
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Fan Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.fans
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>6A Socket Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.sockets6A
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>16A Socket Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.sockets16A
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>AC & TV Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.acs + data.pointCosts.tvs
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item summary-item-total"><span>Pipes, Wires, DB etc. (based on ${
                                      data.houseArea
                                    } sq.ft.):</span> <span>₹${Math.round(
      data.commonMaterialCost
    ).toLocaleString("en-IN")}</span></div>
                                </div>
                            </div>
                        </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    // --- UPDATED: Save Button Logic ---
    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this project:",
        "My Electrical Plan"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          {
            id: `task_${Date.now() + 1}`,
            text: "Hire an electrician",
            done: false,
          },
          {
            id: `task_${Date.now() + 2}`,
            text: "Finalize point locations",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Buy wires and conduit pipes",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Buy switches and fixtures",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Install main DB and earthing",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Electrical",
          total: data.grandTotal,
          data: data,
          savedOn: new Date().toISOString(),
          tasks: defaultTasks, // NEW: Add default tasks
          expenses: [], // NEW: Add empty expenses array
        };
        db.addProject(project);
        showToast("Project saved successfully!");
        if (db.getProjects().length === 1) {
          showInstallPrompt();
        }
      }
    });

    window.scrollTo({
      top: resultsSection.offsetTop - 20,
      behavior: "smooth",
    });
    renderChart(data.totalMaterialCost, data.totalLaborCost);
  }

  function renderChart(material, labor) {
    const ctx = document.getElementById("costChart")?.getContext("2d");
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Material Cost", "Labor Cost"],
        datasets: [
          {
            data: [material, labor],
            backgroundColor: ["#4f46e5", "#10b981"],
            borderColor: "#ffffff",
            borderWidth: 4,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 20, font: { size: 14 } },
          },
        },
      },
    });
  }

  const addRoomBtn = document.getElementById("addRoomBtn");
  const roomContainer = document.getElementById("room-container");

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepVisibility();
    }
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepVisibility();
    }
  });
  addRoomBtn.addEventListener("click", addRoom);
  document
    .getElementById("electricalForm")
    .addEventListener("submit", calculateBudget);
  roomContainer.addEventListener("change", (e) => {
    if (e.target.matches('input[type="number"]')) {
      const { roomId, pointType } = e.target.dataset;
      updateRoomData(roomId, pointType, e.target.value);
    }
  });
  roomContainer.addEventListener("click", (e) => {
    if (e.target.matches(".remove-item-btn")) {
      removeRoom(e.target.dataset.id);
    }
  });

  addRoomBtn.click();
  document.getElementById("roomType").value = "Living Room";
  addRoomBtn.click();
  document.getElementById("roomType").value = "Kitchen";
  addRoomBtn.click();
  updateStepVisibility();
};
=======
// This file exports the template and init logic for the Electrical calculator

export const template = `
<div class="calculator-header">
    <h1>Electrical Budget Calculator</h1>
    <p>Estimate the complete electrical wiring cost for your new Indian home.</p>
</div>
<form id="electricalForm">
    <div class="step-navigation">
    <button id="step-btn-1" class="step-btn active">1. Basics</button>
    <button id="step-btn-2" class="step-btn">2. Rooms</button>
    <button id="step-btn-3" class="step-btn">3. Quality</button>
    <button id="step-btn-4" class="step-btn">4. Labor</button>
    </div>
    <div id="step-1" class="step active">
    <h2>Project Details</h2>
    <div class="form-grid">
        <div><label for="houseArea">Total Built-up Area (sq.ft.)</label><input type="number" id="houseArea" placeholder="e.g., 1200" required /></div>
        <div><label for="floors">Number of Floors</label><input type="number" id="floors" placeholder="e.g., 2" value="1" required /></div>
    </div>
    </div>
    <div id="step-2" class="step">
    <h2>Room & Point Configuration</h2><p>Add each room and specify the number of electrical points.</p>
    <div id="room-container"></div>
    <div style="display: flex; align-items: center; gap: 1rem; margin-top:1rem; border-top:1px solid var(--border-color); padding-top:1rem;">
        <select id="roomType" style="flex-grow: 1;"><option value="Bedroom">Bedroom</option><option value="Living Room">Living Room / Hall</option><option value="Kitchen">Kitchen</option><option value="Bathroom">Bathroom</option><option value="Balcony">Balcony / Utility</option><option value="Staircase">Staircase / Passage</option></select>
        <button type="button" id="addRoomBtn" class="btn btn-primary">Add Room</button>
    </div>
    </div>
    <div id="step-3" class="step">
    <h2>Material Quality</h2><p>Choose the quality of materials.</p>
    <div class="quality-grid">
        <label class="quality-option"><input type="radio" name="brandPreference" value="economy" class="sr-only" checked /><h3>Economy</h3><p>e.g., Anchor Roma</p></label>
        <label class="quality-option"><input type="radio" name="brandPreference" value="mid" class="sr-only" /><h3>Mid-Range</h3><p>e.g., Havells, Polycab</p></label>
        <label class="quality-option"><input type="radio" name="brandPreference" value="premium" class="sr-only" /><h3>Premium</h3><p>e.g., Legrand, Schneider</p></label>
    </div>
    </div>
    <div id="step-4" class="step">
    <h2>Labor Cost Estimation</h2><p>Enter the labor rates prevalent in your area.</p>
    <div class="form-grid">
        <div><label for="laborPerPoint">Labor Rate per Point (₹)</label><input type="number" id="laborPerPoint" value="450" /></div>
        <div><label for="mainPanelLabor">Main Panel & Earthing Labor (₹)</label><input type="number" id="mainPanelLabor" value="5000" /></div>
    </div>
    </div>
    <div class="form-navigation">
    <button type="button" id="prevBtn" class="btn btn-secondary" disabled>Previous</button>
    <button type="button" id="nextBtn" class="btn btn-primary">Next</button>
    <button type="submit" id="submitBtn" class="btn btn-submit hidden">Calculate</button>
    </div>
</form>
<section id="results" class="hidden"></section>
`;

export const init = function (db, showToast, shareResults, showInstallPrompt) {
  let currentStep = 1,
    totalSteps = 4,
    rooms = [],
    chartInstance = null;
  const costData = {
    items: {
      lightPoint: { economy: 450, mid: 700, premium: 1500 },
      fanPoint: { economy: 2000, mid: 3500, premium: 6000 },
      socket6A: { economy: 300, mid: 500, premium: 900 },
      socket16A: { economy: 550, mid: 800, premium: 1300 },
      acPoint: { economy: 1200, mid: 1800, premium: 2500 },
      tvPoint: { economy: 400, mid: 650, premium: 1100 },
    },
    commonMaterials: {
      pipe: { economy: 8, mid: 12, premium: 20 },
      mainWire: { economy: 15, mid: 25, premium: 45 },
      db: { economy: 4, mid: 7, premium: 12 },
    },
  };
  const roomDefaults = {
    Bedroom: {
      lights: 3,
      fans: 1,
      sockets6A: 4,
      sockets16A: 1,
      acs: 1,
      tvs: 1,
    },
    "Living Room": {
      lights: 4,
      fans: 2,
      sockets6A: 5,
      sockets16A: 1,
      acs: 1,
      tvs: 1,
    },
    Kitchen: {
      lights: 2,
      fans: 0,
      sockets6A: 3,
      sockets16A: 3,
      acs: 0,
      tvs: 0,
    },
    Bathroom: {
      lights: 2,
      fans: 0,
      sockets6A: 1,
      sockets16A: 1,
      acs: 0,
      tvs: 0,
    },
    Balcony: {
      lights: 1,
      fans: 0,
      sockets6A: 1,
      sockets16A: 0,
      acs: 0,
      tvs: 0,
    },
    Staircase: {
      lights: 2,
      fans: 0,
      sockets6A: 1,
      sockets16A: 0,
      acs: 0,
      tvs: 0,
    },
  };

  function updateStepVisibility() {
    document
      .querySelectorAll(".step")
      .forEach((step, index) =>
        step.classList.toggle("active", index + 1 === currentStep)
      );
    document
      .querySelectorAll(".step-btn")
      .forEach((btn, index) =>
        btn.classList.toggle("active", index < currentStep)
      );
    document.getElementById("prevBtn").disabled = currentStep === 1;
    document
      .getElementById("nextBtn")
      .classList.toggle("hidden", currentStep === totalSteps);
    document
      .getElementById("submitBtn")
      .classList.toggle("hidden", currentStep !== totalSteps);
  }

  function addRoom() {
    const roomType = document.getElementById("roomType").value;
    const roomId = `room-${Date.now()}`;
    const defaults = roomDefaults[roomType];
    const room = { id: roomId, type: roomType, ...defaults };
    rooms.push(room);
    renderRooms();
  }

  function createInput(name, label, id, value) {
    return `<div class="input-group"><label>${label}</label><input type="number" data-room-id="${id}" data-point-type="${name}" value="${value}" min="0" style="width: 70px; text-align: center; padding: 0.5rem;"></div>`;
  }

  function renderRooms() {
    const roomContainer = document.getElementById("room-container");
    roomContainer.innerHTML = rooms
      .map(
        (room) => `
                        <div id="${room.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${room.type}</h3>
                                <button type="button" class="remove-item-btn" data-id="${
                                  room.id
                                }">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.875rem; @media (min-width: 1024px) { grid-template-columns: repeat(6, 1fr); }">
                                ${createInput(
                                  "lights",
                                  "Lights",
                                  room.id,
                                  room.lights
                                )}
                                ${createInput(
                                  "fans",
                                  "Fans",
                                  room.id,
                                  room.fans
                                )}
                                ${createInput(
                                  "sockets6A",
                                  "6A Sockets",
                                  room.id,
                                  room.sockets6A
                                )}
                                ${createInput(
                                  "sockets16A",
                                  "16A Sockets",
                                  room.id,
                                  room.sockets16A
                                )}
                                ${createInput(
                                  "acs",
                                  "AC Points",
                                  room.id,
                                  room.acs
                                )}
                                ${createInput(
                                  "tvs",
                                  "TV/Data",
                                  room.id,
                                  room.tvs
                                )}
                            </div>
                        </div>`
      )
      .join("");
  }

  function removeRoom(roomId) {
    rooms = rooms.filter((room) => room.id !== roomId);
    renderRooms();
  }

  function updateRoomData(roomId, pointType, value) {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      room[pointType] = parseInt(value, 10) || 0;
    }
  }

  function calculateBudget(e) {
    e.preventDefault();
    const houseArea =
      parseFloat(document.getElementById("houseArea").value) || 0;
    const quality = document.querySelector(
      'input[name="brandPreference"]:checked'
    ).value;
    const laborPerPoint =
      parseFloat(document.getElementById("laborPerPoint").value) || 0;
    const mainPanelLabor =
      parseFloat(document.getElementById("mainPanelLabor").value) || 0;
    const totalPoints = rooms.reduce(
      (acc, room) =>
        acc +
        room.lights +
        room.fans +
        room.sockets6A +
        room.sockets16A +
        room.acs +
        room.tvs,
      0
    );
    const pointCosts = rooms.reduce(
      (acc, room) => {
        acc.lights += room.lights * costData.items.lightPoint[quality];
        acc.fans += room.fans * costData.items.fanPoint[quality];
        acc.sockets6A += room.sockets6A * costData.items.socket6A[quality];
        acc.sockets16A += room.sockets16A * costData.items.socket16A[quality];
        acc.acs += room.acs * costData.items.acPoint[quality];
        acc.tvs += room.tvs * costData.items.tvPoint[quality];
        return acc;
      },
      {
        lights: 0,
        fans: 0,
        sockets6A: 0,
        sockets16A: 0,
        acs: 0,
        tvs: 0,
      }
    );
    const totalPointMaterialCost = Object.values(pointCosts).reduce(
      (a, b) => a + b,
      0
    );
    const commonMaterialCost =
      (costData.commonMaterials.pipe[quality] +
        costData.commonMaterials.mainWire[quality] +
        costData.commonMaterials.db[quality]) *
      houseArea;
    const totalMaterialCost = totalPointMaterialCost + commonMaterialCost;
    const totalLaborCost = totalPoints * laborPerPoint + mainPanelLabor;
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      totalPoints,
      pointCosts,
      commonMaterialCost,
      houseArea,
      // Data for saving
      inputs: {
        houseArea,
        quality,
        laborPerPoint,
        mainPanelLabor,
        rooms: [...rooms],
      },
    });
  }

  function displayResults(data) {
    const resultsSection = document.getElementById("results");
    resultsSection.innerHTML = `
                        <header class="results-header">
                            <h2>Your Estimated Budget</h2>
                            <div style="display: flex; gap: 0.5rem;">
                                <button id="saveBtn" class="btn btn-secondary">Save Project</button>
                                <button id="shareBtn" class="btn btn-primary">Share</button>
                            </div>
                        </header>
                        <div class="results-card" id="results-card">
                            <div class="results-grid">
                                <div class="chart-container"><canvas id="costChart"></canvas></div>
                                <div>
                                    <p>Total Estimated Cost</p><p id="grandTotal">₹${Math.round(
                                      data.grandTotal
                                    ).toLocaleString("en-IN")}</p>
                                    <div class="summary-details">
                                        <div class="summary-item"><span>Total Material Cost:</span><span id="totalMaterialCost">₹${Math.round(
                                          data.totalMaterialCost
                                        ).toLocaleString("en-IN")}</span></div>
                                        <div class="summary-item"><span>Total Labor Cost:</span><span id="totalLaborCost">₹${Math.round(
                                          data.totalLaborCost
                                        ).toLocaleString("en-IN")}</span></div>
                                        <div class="summary-item summary-item-total"><span>Total Electrical Points:</span><span id="totalPoints">${
                                          data.totalPoints
                                        }</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Material Breakdown</h3>
                                <div id="detailed-breakdown">
                                    <div class="summary-item"><span>Light Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.lights
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Fan Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.fans
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>6A Socket Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.sockets6A
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>16A Socket Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.sockets16A
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>AC & TV Points Cost:</span> <span>₹${Math.round(
                                      data.pointCosts.acs + data.pointCosts.tvs
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item summary-item-total"><span>Pipes, Wires, DB etc. (based on ${
                                      data.houseArea
                                    } sq.ft.):</span> <span>₹${Math.round(
      data.commonMaterialCost
    ).toLocaleString("en-IN")}</span></div>
                                </div>
                            </div>
                        </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    // --- UPDATED: Save Button Logic ---
    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this project:",
        "My Electrical Plan"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          {
            id: `task_${Date.now() + 1}`,
            text: "Hire an electrician",
            done: false,
          },
          {
            id: `task_${Date.now() + 2}`,
            text: "Finalize point locations",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Buy wires and conduit pipes",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Buy switches and fixtures",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Install main DB and earthing",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Electrical",
          total: data.grandTotal,
          data: data,
          savedOn: new Date().toISOString(),
          tasks: defaultTasks, // NEW: Add default tasks
          expenses: [], // NEW: Add empty expenses array
        };
        db.addProject(project);
        showToast("Project saved successfully!");
        if (db.getProjects().length === 1) {
          showInstallPrompt();
        }
      }
    });

    window.scrollTo({
      top: resultsSection.offsetTop - 20,
      behavior: "smooth",
    });
    renderChart(data.totalMaterialCost, data.totalLaborCost);
  }

  function renderChart(material, labor) {
    const ctx = document.getElementById("costChart")?.getContext("2d");
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Material Cost", "Labor Cost"],
        datasets: [
          {
            data: [material, labor],
            backgroundColor: ["#4f46e5", "#10b981"],
            borderColor: "#ffffff",
            borderWidth: 4,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 20, font: { size: 14 } },
          },
        },
      },
    });
  }

  const addRoomBtn = document.getElementById("addRoomBtn");
  const roomContainer = document.getElementById("room-container");

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepVisibility();
    }
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepVisibility();
    }
  });
  addRoomBtn.addEventListener("click", addRoom);
  document
    .getElementById("electricalForm")
    .addEventListener("submit", calculateBudget);
  roomContainer.addEventListener("change", (e) => {
    if (e.target.matches('input[type="number"]')) {
      const { roomId, pointType } = e.target.dataset;
      updateRoomData(roomId, pointType, e.target.value);
    }
  });
  roomContainer.addEventListener("click", (e) => {
    if (e.target.matches(".remove-item-btn")) {
      removeRoom(e.target.dataset.id);
    }
  });

  addRoomBtn.click();
  document.getElementById("roomType").value = "Living Room";
  addRoomBtn.click();
  document.getElementById("roomType").value = "Kitchen";
  addRoomBtn.click();
  updateStepVisibility();
};

