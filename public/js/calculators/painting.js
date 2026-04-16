
// js/calculators/painting.js

export const template = `
<div class="calculator-header"><h1>Paint Budget Calculator</h1></div>
<form id="paintForm">
  <div class="step-navigation">
    <button id="step-btn-1" class="step-btn active">1. Areas</button>
    <button id="step-btn-2" class="step-btn">2. Quality</button>
    <button id="step-btn-3" class="step-btn">3. Labor</button>
  </div>
  <div id="step-1" class="step active">
    <h2>Define Painting Areas</h2><p>Add each area to be painted and provide its dimensions.</p>
    <div id="areas-container"></div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; align-items: end; border-top: 1px solid var(--border-color); padding-top: 1.5rem; margin-top: 1.5rem;">
      <div><label for="areaName">Area Name</label><input type="text" id="areaName" placeholder="e.g., Living Room Walls" /></div>
      <button type="button" id="addAreaBtn" class="btn btn-primary">Add Area</button>
    </div>
  </div>
  <div id="step-2" class="step">
     <h2>Paint Quality & Coats</h2><p>Select the paint quality. This affects both price and coverage.</p>
    <div class="quality-grid">
      <label class="quality-option"><input type="radio" name="paintQuality" value="basic" class="sr-only" checked /><h3>Basic Emulsion</h3><p>₹250 / Litre</p></label>
      <label class="quality-option"><input type="radio" name="paintQuality" value="premium" class="sr-only" /><h3>Premium Emulsion</h3><p>₹450 / Litre</p></label>
      <label class="quality-option"><input type="radio" name="paintQuality" value="luxury" class="sr-only" /><h3>Luxury Emulsion</h3><p>₹700 / Litre</p></label>
    </div>
    <div class="form-grid" style="margin-top: 1.5rem;">
      <div><label for="coats">Number of Coats</label><select id="coats"><option value="1">1 Coat</option><option value="2" selected>2 Coats</option><option value="3">3 Coats</option></select></div>
      <div><label for="puttyRequired">Putty Required?</label><select id="puttyRequired"><option value="no">No</option><option value="yes">Yes (2 coats)</option></select></div>
    </div>
  </div>
  <div id="step-3" class="step">
    <h2>Labor Costs</h2><p>Enter local labor rates for painting and putty application.</p>
    <div class="form-grid">
      <div><label for="paintingLabor">Painting Labor (₹ per sq.ft.)</label><input type="number" id="paintingLabor" value="15" /></div>
      <div><label for="puttyLabor">Putty Labor (₹ per sq.ft.)</label><input type="number" id="puttyLabor" value="10" /></div>
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
    totalSteps = 3,
    areas = [],
    chartInstance = null;
  const costData = {
    paintPerLitre: { basic: 250, premium: 450, luxury: 700 },
    coverageSqFtPerLitre: { basic: 130, premium: 150, luxury: 160 },
    puttyPerKg: 20,
    puttyCoverageSqFtPerKg: 15, // for 2 coats
  };

  function updateStepVisibility() {
    document
      .querySelectorAll(".step")
      .forEach((s, i) => s.classList.toggle("active", i + 1 === currentStep));
    document
      .querySelectorAll(".step-btn")
      .forEach((b, i) => b.classList.toggle("active", i < currentStep));
    document.getElementById("prevBtn").disabled = currentStep === 1;
    document
      .getElementById("nextBtn")
      .classList.toggle("hidden", currentStep === totalSteps);
    document
      .getElementById("submitBtn")
      .classList.toggle("hidden", currentStep !== totalSteps);
  }

  function addArea() {
    const nameInput = document.getElementById("areaName");
    const name = nameInput.value.trim() || `Area ${areas.length + 1}`;
    areas.push({
      id: `area-${Date.now()}`,
      name,
      length: 10,
      height: 10,
      color: "#e5e7eb", // Default color
    });
    nameInput.value = "";
    renderAreas();
  }

  function renderAreas() {
    const container = document.getElementById("areas-container");
    container.innerHTML = areas
      .map(
        (area) => `
                        <div id="${area.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${area.name}</h3>
                                <button type="button" class="remove-item-btn" data-id="${area.id}">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 70px; gap: 1rem; margin-top: 1rem; align-items: end;">
                                <div><label>Length (ft)</label><input type="number" class="area-input" data-id="${area.id}" data-prop="length" value="${area.length}"></div>
                                <div><label>Height (ft)</label><input type="number" class="area-input" data-id="${area.id}" data-prop="height" value="${area.height}"></div>
                                <div><label>Color</label><input type="color" class="area-input" data-id="${area.id}" data-prop="color" value="${area.color}" style="width: 50px; height: 50px; border-radius: var(--border-radius-lg); border: 2px solid var(--border-color); padding: 0; cursor: pointer; margin: 0 auto;"></div>
                            </div>
                        </div>`
      )
      .join("");
  }

  function updateArea(id, prop, value) {
    const area = areas.find((a) => a.id === id);
    if (area) {
      area[prop] = prop === "color" ? value : parseFloat(value) || 0;
    }
  }

  function calculateBudget(e) {
    e.preventDefault();
    const quality = document.querySelector(
      'input[name="paintQuality"]:checked'
    ).value;
    const coats = parseInt(document.getElementById("coats").value);
    const puttyRequired =
      document.getElementById("puttyRequired").value === "yes";
    const paintingLaborRate =
      parseFloat(document.getElementById("paintingLabor").value) || 0;
    const puttyLaborRate =
      parseFloat(document.getElementById("puttyLabor").value) || 0;
    let totalArea = 0;
    areas.forEach((a) => {
      totalArea += a.length * a.height;
    });
    const paintNeeded =
      (totalArea * coats) / costData.coverageSqFtPerLitre[quality];
    const paintCost = paintNeeded * costData.paintPerLitre[quality];
    let puttyCost = 0,
      puttyLaborCost = 0;
    if (puttyRequired) {
      const puttyNeeded = totalArea / costData.puttyCoverageSqFtPerKg;
      puttyCost = puttyNeeded * costData.puttyPerKg;
      puttyLaborCost = totalArea * puttyLaborRate;
    }
    const paintingLaborCost = totalArea * paintingLaborRate * coats;
    const totalMaterialCost = paintCost + puttyCost;
    const totalLaborCost = paintingLaborCost + puttyLaborCost;
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      paintCost,
      puttyCost,
      paintingLaborCost,
      puttyLaborCost,
      // Data for saving
      inputs: {
        areas: [...areas], // Save a copy
        quality,
        coats,
        puttyRequired,
        paintingLaborRate,
        puttyLaborRate,
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
                                        <div class="summary-item"><span>Material Cost:</span><span>₹${Math.round(
                                          data.totalMaterialCost
                                        ).toLocaleString("en-IN")}</span></div>
                                        <div class="summary-item"><span>Labor Cost:</span><span>₹${Math.round(
                                          data.totalLaborCost
                                        ).toLocaleString("en-IN")}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Breakdown</h3>
                                <div class="summary-item"><span>Paint Material:</span> <span>₹${Math.round(
                                  data.paintCost
                                ).toLocaleString("en-IN")}</span></div>
                                <div class="summary-item"><span>Putty Material:</span> <span>₹${Math.round(
                                  data.puttyCost
                                ).toLocaleString("en-IN")}</span></div>
                                <div class="summary-item"><span>Painting Labor:</span> <span>₹${Math.round(
                                  data.paintingLaborCost
                                ).toLocaleString("en-IN")}</span></div>
                                <div class="summary-item"><span>Putty Labor:</span> <span>₹${Math.round(
                                  data.puttyLaborCost
                                ).toLocaleString("en-IN")}</span></div>
                            </div>
                        </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    // --- UPDATED: Save Button Logic ---
    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this project:",
        "My Painting Project"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          {
            id: `task_${Date.now() + 1}`,
            text: "Finalize paint colors",
            done: false,
          },
          {
            id: `task_${Date.now() + 2}`,
            text: "Hire painting contractor",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Purchase paints and supplies",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Complete wall putty/sanding",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Start final painting",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Painting",
          total: data.grandTotal,
          data: data, // Save the full data object
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
            backgroundColor: ["#db2777", "#16a34a"],
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

  // --- Event Listeners ---
  document.getElementById("addAreaBtn").addEventListener("click", addArea);

  // Use event delegation for area inputs and remove buttons
  const areasContainer = document.getElementById("areas-container");
  if (areasContainer) {
    areasContainer.addEventListener("change", (e) => {
      if (e.target.matches(".area-input")) {
        updateArea(e.target.dataset.id, e.target.dataset.prop, e.target.value);
      }
    });
    areasContainer.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".remove-item-btn");
      if (removeBtn) {
        e.preventDefault();
        areas = areas.filter((a) => a.id !== removeBtn.dataset.id);
        renderAreas();
      }
    });
  }

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
  document
    .getElementById("paintForm")
    .addEventListener("submit", calculateBudget);

  // Initial setup
  addArea(); // Add one area by default
  updateStepVisibility();
};


export const template = `
<div class="calculator-header"><h1>Paint Budget Calculator</h1></div>
<form id="paintForm">
  <div class="step-navigation">
    <button id="step-btn-1" class="step-btn active">1. Areas</button>
    <button id="step-btn-2" class="step-btn">2. Quality</button>
    <button id="step-btn-3" class="step-btn">3. Labor</button>
  </div>
  <div id="step-1" class="step active">
    <h2>Define Painting Areas</h2><p>Add each area to be painted and provide its dimensions.</p>
    <div id="areas-container"></div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; align-items: end; border-top: 1px solid var(--border-color); padding-top: 1.5rem; margin-top: 1.5rem;">
      <div><label for="areaName">Area Name</label><input type="text" id="areaName" placeholder="e.g., Living Room Walls" /></div>
      <button type="button" id="addAreaBtn" class="btn btn-primary">Add Area</button>
    </div>
  </div>
  <div id="step-2" class="step">
     <h2>Paint Quality & Coats</h2><p>Select the paint quality. This affects both price and coverage.</p>
    <div class="quality-grid">
      <label class="quality-option"><input type="radio" name="paintQuality" value="basic" class="sr-only" checked /><h3>Basic Emulsion</h3><p>₹250 / Litre</p></label>
      <label class="quality-option"><input type="radio" name="paintQuality" value="premium" class="sr-only" /><h3>Premium Emulsion</h3><p>₹450 / Litre</p></label>
      <label class="quality-option"><input type="radio" name="paintQuality" value="luxury" class="sr-only" /><h3>Luxury Emulsion</h3><p>₹700 / Litre</p></label>
    </div>
    <div class="form-grid" style="margin-top: 1.5rem;">
      <div><label for="coats">Number of Coats</label><select id="coats"><option value="1">1 Coat</option><option value="2" selected>2 Coats</option><option value="3">3 Coats</option></select></div>
      <div><label for="puttyRequired">Putty Required?</label><select id="puttyRequired"><option value="no">No</option><option value="yes">Yes (2 coats)</option></select></div>
    </div>
  </div>
  <div id="step-3" class="step">
    <h2>Labor Costs</h2><p>Enter local labor rates for painting and putty application.</p>
    <div class="form-grid">
      <div><label for="paintingLabor">Painting Labor (₹ per sq.ft.)</label><input type="number" id="paintingLabor" value="15" /></div>
      <div><label for="puttyLabor">Putty Labor (₹ per sq.ft.)</label><input type="number" id="puttyLabor" value="10" /></div>
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
    totalSteps = 3,
    areas = [],
    chartInstance = null;
  const costData = {
    paintPerLitre: { basic: 250, premium: 450, luxury: 700 },
    coverageSqFtPerLitre: { basic: 130, premium: 150, luxury: 160 },
    puttyPerKg: 20,
    puttyCoverageSqFtPerKg: 15, // for 2 coats
  };

  function updateStepVisibility() {
    document
      .querySelectorAll(".step")
      .forEach((s, i) => s.classList.toggle("active", i + 1 === currentStep));
    document
      .querySelectorAll(".step-btn")
      .forEach((b, i) => b.classList.toggle("active", i < currentStep));
    document.getElementById("prevBtn").disabled = currentStep === 1;
    document
      .getElementById("nextBtn")
      .classList.toggle("hidden", currentStep === totalSteps);
    document
      .getElementById("submitBtn")
      .classList.toggle("hidden", currentStep !== totalSteps);
  }

  function addArea() {
    const nameInput = document.getElementById("areaName");
    const name = nameInput.value.trim() || `Area ${areas.length + 1}`;
    areas.push({
      id: `area-${Date.now()}`,
      name,
      length: 10,
      height: 10,
      color: "#e5e7eb", // Default color
    });
    nameInput.value = "";
    renderAreas();
  }

  function renderAreas() {
    const container = document.getElementById("areas-container");
    container.innerHTML = areas
      .map(
        (area) => `
                        <div id="${area.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${area.name}</h3>
                                <button type="button" class="remove-item-btn" data-id="${area.id}">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 70px; gap: 1rem; margin-top: 1rem; align-items: end;">
                                <div><label>Length (ft)</label><input type="number" class="area-input" data-id="${area.id}" data-prop="length" value="${area.length}"></div>
                                <div><label>Height (ft)</label><input type="number" class="area-input" data-id="${area.id}" data-prop="height" value="${area.height}"></div>
                                <div><label>Color</label><input type="color" class="area-input" data-id="${area.id}" data-prop="color" value="${area.color}" style="width: 50px; height: 50px; border-radius: var(--border-radius-lg); border: 2px solid var(--border-color); padding: 0; cursor: pointer; margin: 0 auto;"></div>
                            </div>
                        </div>`
      )
      .join("");
  }

  function updateArea(id, prop, value) {
    const area = areas.find((a) => a.id === id);
    if (area) {
      area[prop] = prop === "color" ? value : parseFloat(value) || 0;
    }
  }

  function calculateBudget(e) {
    e.preventDefault();
    const quality = document.querySelector(
      'input[name="paintQuality"]:checked'
    ).value;
    const coats = parseInt(document.getElementById("coats").value);
    const puttyRequired =
      document.getElementById("puttyRequired").value === "yes";
    const paintingLaborRate =
      parseFloat(document.getElementById("paintingLabor").value) || 0;
    const puttyLaborRate =
      parseFloat(document.getElementById("puttyLabor").value) || 0;
    let totalArea = 0;
    areas.forEach((a) => {
      totalArea += a.length * a.height;
    });
    const paintNeeded =
      (totalArea * coats) / costData.coverageSqFtPerLitre[quality];
    const paintCost = paintNeeded * costData.paintPerLitre[quality];
    let puttyCost = 0,
      puttyLaborCost = 0;
    if (puttyRequired) {
      const puttyNeeded = totalArea / costData.puttyCoverageSqFtPerKg;
      puttyCost = puttyNeeded * costData.puttyPerKg;
      puttyLaborCost = totalArea * puttyLaborRate;
    }
    const paintingLaborCost = totalArea * paintingLaborRate * coats;
    const totalMaterialCost = paintCost + puttyCost;
    const totalLaborCost = paintingLaborCost + puttyLaborCost;
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      paintCost,
      puttyCost,
      paintingLaborCost,
      puttyLaborCost,
      // Data for saving
      inputs: {
        areas: [...areas], // Save a copy
        quality,
        coats,
        puttyRequired,
        paintingLaborRate,
        puttyLaborRate,
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
                                        <div class="summary-item"><span>Material Cost:</span><span>₹${Math.round(
                                          data.totalMaterialCost
                                        ).toLocaleString("en-IN")}</span></div>
                                        <div class="summary-item"><span>Labor Cost:</span><span>₹${Math.round(
                                          data.totalLaborCost
                                        ).toLocaleString("en-IN")}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Breakdown</h3>
                                <div class="summary-item"><span>Paint Material:</span> <span>₹${Math.round(
                                  data.paintCost
                                ).toLocaleString("en-IN")}</span></div>
                                <div class="summary-item"><span>Putty Material:</span> <span>₹${Math.round(
                                  data.puttyCost
                                ).toLocaleString("en-IN")}</span></div>
                                <div class="summary-item"><span>Painting Labor:</span> <span>₹${Math.round(
                                  data.paintingLaborCost
                                ).toLocaleString("en-IN")}</span></div>
                                <div class="summary-item"><span>Putty Labor:</span> <span>₹${Math.round(
                                  data.puttyLaborCost
                                ).toLocaleString("en-IN")}</span></div>
                            </div>
                        </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    // --- UPDATED: Save Button Logic ---
    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this project:",
        "My Painting Project"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          {
            id: `task_${Date.now() + 1}`,
            text: "Finalize paint colors",
            done: false,
          },
          {
            id: `task_${Date.now() + 2}`,
            text: "Hire painting contractor",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Purchase paints and supplies",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Complete wall putty/sanding",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Start final painting",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Painting",
          total: data.grandTotal,
          data: data, // Save the full data object
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
            backgroundColor: ["#db2777", "#16a34a"],
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

  // --- Event Listeners ---
  document.getElementById("addAreaBtn").addEventListener("click", addArea);

  // Use event delegation for area inputs and remove buttons
  const areasContainer = document.getElementById("areas-container");
  if (areasContainer) {
    areasContainer.addEventListener("change", (e) => {
      if (e.target.matches(".area-input")) {
        updateArea(e.target.dataset.id, e.target.dataset.prop, e.target.value);
      }
    });
    areasContainer.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".remove-item-btn");
      if (removeBtn) {
        e.preventDefault();
        areas = areas.filter((a) => a.id !== removeBtn.dataset.id);
        renderAreas();
      }
    });
  }

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
  document
    .getElementById("paintForm")
    .addEventListener("submit", calculateBudget);

  // Initial setup
  addArea(); // Add one area by default
  updateStepVisibility();
};

