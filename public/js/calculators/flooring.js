
// This file exports the template and init logic for the Flooring calculator

export const template = `
<div class="calculator-header">
    <h1>Floor & Wall Tile Budget Calculator</h1>
    <p>Estimate the complete tiling cost for your new Indian home.</p>
</div>
<form id="tileForm">
    <div class="step-navigation">
        <button id="step-btn-1" class="step-btn active">1. Areas</button>
        <button id="step-btn-2" class="step-btn">2. Materials</button>
        <button id="step-btn-3" class="step-btn">3. Labor</button>
    </div>
    <div id="step-1" class="step active">
        <h2>Define Areas to be Tiled</h2>
        <p>Add each area (floor or wall), and provide its dimensions.</p>
        <div id="area-container"></div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
            <div><label for="areaName">Area Name</label><input type="text" id="areaName" placeholder="e.g., Living Room Floor" /></div>
            <button type="button" id="addAreaBtn" class="btn btn-primary">Add Area</button>
        </div>
    </div>
    <div id="step-2" class="step">
        <h2>Tile & Material Quality</h2>
        <p>Choose the quality of tiles and other materials.</p>
        <div class="quality-grid">
            <label class="quality-option"><input type="radio" name="tileQuality" value="economy" class="sr-only" checked /><h3>Economy</h3><p>Basic Ceramic (Approx. ₹40/sq.ft)</p></label>
            <label class="quality-option"><input type="radio" name="tileQuality" value="mid" class="sr-only" /><h3>Mid-Range</h3><p>Vitrified (GVT) (Approx. ₹75/sq.ft)</p></label>
            <label class="quality-option"><input type="radio" name="tileQuality" value="premium" class="sr-only" /><h3>Premium</h3><p>Designer / PGVT (Approx. ₹120/sq.ft)</p></label>
        </div>
        <div class="form-grid" style="margin-top: 1.5rem">
            <div><label for="wastage">Tile Wastage (%)</label><input type="number" id="wastage" value="10" /></div>
        </div>
    </div>
    <div id="step-3" class="step">
        <h2>Labor Cost Estimation</h2>
        <p>Costs vary by city. Enter the rates for your area.</p>
        <div class="form-grid">
            <div><label for="tilingLabor">Tiling Labor (₹ per sq.ft.)</label><input type="number" id="tilingLabor" value="25" /></div>
            <div><label for="skirtingLabor">Skirting Labor (₹ per running ft.)</label><input type="number" id="skirtingLabor" value="20" /></div>
            <div><label for="hackingLabor">Old Tile Removal (₹ per sq.ft.)</label><input type="number" id="hackingLabor" value="10" placeholder="0 if not applicable"/></div>
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
    tilePerSqFt: { economy: 40, mid: 75, premium: 120 },
    adhesivePerSqFt: { economy: 15, mid: 25, premium: 40 },
    skirtingTilePerRft: { economy: 25, mid: 40, premium: 60 },
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
    const areaNameInput = document.getElementById("areaName");
    const name = areaNameInput.value.trim() || `Area ${areas.length + 1}`;
    areas.push({
      id: `area-${Date.now()}`,
      name,
      length: 10,
      width: 10,
      skirtingRft: 40,
    });
    areaNameInput.value = "";
    renderAreas();
  }

  function renderAreas() {
    const areaContainer = document.getElementById("area-container");
    areaContainer.innerHTML = areas
      .map(
        (area) => `
                        <div id="${area.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${area.name}</h3>
                                <button type="button" class="remove-item-btn" data-id="${
                                  area.id
                                }">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-size: 0.875rem; @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); align-items: end; }">
                                <div class="input-group"><label>Length (ft)</label><input type="number" class="area-input" data-id="${
                                  area.id
                                }" data-prop="length" value="${
          area.length
        }" style="padding: 0.5rem;"></div>
                                <div class="input-group"><label>Width / Height (ft)</label><input type="number" class="area-input" data-id="${
                                  area.id
                                }" data-prop="width" value="${
          area.width
        }" style="padding: 0.5rem;"></div>
                                <div class="input-group"><label>Skirting (running ft)</label><input type="number" class="area-input" data-id="${
                                  area.id
                                }" data-prop="skirtingRft" value="${
          area.skirtingRft
        }" placeholder="0 if none" style="padding: 0.5rem;"></div>
                                <div class="input-group"><label><strong>Area (sq.ft.)</strong></label><input type="number" value="${
                                  area.length * area.width
                                }" disabled style="background:#eef2ff; font-weight:bold; padding: 0.5rem;"></div>
                            </div>
                        </div>`
      )
      .join("");
  }

  function updateArea(areaId, prop, value) {
    const area = areas.find((a) => a.id === areaId);
    if (area) {
      area[prop] = parseFloat(value) || 0;
      renderAreas();
    }
  }

  function removeArea(areaId) {
    areas = areas.filter((a) => a.id !== areaId);
    renderAreas();
  }

  function calculateBudget(e) {
    e.preventDefault();
    const quality = document.querySelector(
      'input[name="tileQuality"]:checked'
    ).value;
    const wastagePercent =
      parseFloat(document.getElementById("wastage").value) || 0;
    const tilingLabor =
      parseFloat(document.getElementById("tilingLabor").value) || 0;
    const skirtingLabor =
      parseFloat(document.getElementById("skirtingLabor").value) || 0;
    const hackingLabor =
      parseFloat(document.getElementById("hackingLabor").value) || 0;
    let totalArea = 0,
      totalSkirtingRft = 0;
    areas.forEach((a) => {
      totalArea += a.length * a.width;
      totalSkirtingRft += a.skirtingRft;
    });
    const areaWithWastage = totalArea * (1 + wastagePercent / 100);
    const tileCost = areaWithWastage * costData.tilePerSqFt[quality];
    const adhesiveCost = totalArea * costData.adhesivePerSqFt[quality];
    const skirtingMaterialCost =
      totalSkirtingRft * costData.skirtingTilePerRft[quality];
    const totalMaterialCost = tileCost + adhesiveCost + skirtingMaterialCost;
    const tilingLaborCost = totalArea * tilingLabor;
    const skirtingLaborCost = totalSkirtingRft * skirtingLabor;
    const hackingLaborCost = totalArea * hackingLabor;
    const totalLaborCost =
      tilingLaborCost + skirtingLaborCost + hackingLaborCost;
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      totalArea,
      tileCost,
      adhesiveCost,
      skirtingMaterialCost,
      tilingLaborCost,
      skirtingLaborCost,
      hackingLaborCost,
      // Data for saving
      inputs: {
        areas: [...areas],
        quality,
        wastagePercent,
        tilingLabor,
        skirtingLabor,
        hackingLabor,
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
                                        <div class="summary-item summary-item-total"><span>Total Tiling Area:</span><span id="totalArea">${data.totalArea.toFixed(
                                          2
                                        )} sq.ft.</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Cost Breakdown</h3>
                                <div id="detailed-breakdown">
                                    <div class="summary-item"><span>Tile Cost (with wastage):</span> <span>₹${Math.round(
                                      data.tileCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Adhesive, Grout etc.:</span> <span>₹${Math.round(
                                      data.adhesiveCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Skirting Material Cost:</span> <span>₹${Math.round(
                                      data.skirtingMaterialCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item" style="margin-top:0.5rem; border-top:1px solid #eee; padding-top:0.5rem;"><span>Tiling Labor Cost:</span> <span>₹${Math.round(
                                      data.tilingLaborCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Skirting Labor Cost:</span> <span>₹${Math.round(
                                      data.skirtingLaborCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Hacking / Removal Cost:</span> <span>₹${Math.round(
                                      data.hackingLaborCost
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
        "My Flooring Project"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          {
            id: `task_${Date.now() + 1}`,
            text: "Finalize tile selection",
            done: false,
          },
          {
            id: `task_${Date.now() + 2}`,
            text: "Hire tiling contractor",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Purchase tiles and adhesive",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Ensure floor leveling is done",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Start tiling work",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Flooring",
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
            backgroundColor: ["#0d9488", "#f97316"],
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

  const addAreaBtn = document.getElementById("addAreaBtn");
  const areaContainer = document.getElementById("area-container");
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
  addAreaBtn.addEventListener("click", addArea);
  document
    .getElementById("tileForm")
    .addEventListener("submit", calculateBudget);
  areaContainer.addEventListener("change", (e) => {
    if (e.target.matches(".area-input"))
      updateArea(e.target.dataset.id, e.target.dataset.prop, e.target.value);
  });
  areaContainer.addEventListener("click", (e) => {
    if (e.target.matches(".remove-item-btn")) removeArea(e.target.dataset.id);
  });
  addArea();
  updateStepVisibility();
};

// This file exports the template and init logic for the Flooring calculator

export const template = `
<div class="calculator-header">
    <h1>Floor & Wall Tile Budget Calculator</h1>
    <p>Estimate the complete tiling cost for your new Indian home.</p>
</div>
<form id="tileForm">
    <div class="step-navigation">
        <button id="step-btn-1" class="step-btn active">1. Areas</button>
        <button id="step-btn-2" class="step-btn">2. Materials</button>
        <button id="step-btn-3" class="step-btn">3. Labor</button>
    </div>
    <div id="step-1" class="step active">
        <h2>Define Areas to be Tiled</h2>
        <p>Add each area (floor or wall), and provide its dimensions.</p>
        <div id="area-container"></div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
            <div><label for="areaName">Area Name</label><input type="text" id="areaName" placeholder="e.g., Living Room Floor" /></div>
            <button type="button" id="addAreaBtn" class="btn btn-primary">Add Area</button>
        </div>
    </div>
    <div id="step-2" class="step">
        <h2>Tile & Material Quality</h2>
        <p>Choose the quality of tiles and other materials.</p>
        <div class="quality-grid">
            <label class="quality-option"><input type="radio" name="tileQuality" value="economy" class="sr-only" checked /><h3>Economy</h3><p>Basic Ceramic (Approx. ₹40/sq.ft)</p></label>
            <label class="quality-option"><input type="radio" name="tileQuality" value="mid" class="sr-only" /><h3>Mid-Range</h3><p>Vitrified (GVT) (Approx. ₹75/sq.ft)</p></label>
            <label class="quality-option"><input type="radio" name="tileQuality" value="premium" class="sr-only" /><h3>Premium</h3><p>Designer / PGVT (Approx. ₹120/sq.ft)</p></label>
        </div>
        <div class="form-grid" style="margin-top: 1.5rem">
            <div><label for="wastage">Tile Wastage (%)</label><input type="number" id="wastage" value="10" /></div>
        </div>
    </div>
    <div id="step-3" class="step">
        <h2>Labor Cost Estimation</h2>
        <p>Costs vary by city. Enter the rates for your area.</p>
        <div class="form-grid">
            <div><label for="tilingLabor">Tiling Labor (₹ per sq.ft.)</label><input type="number" id="tilingLabor" value="25" /></div>
            <div><label for="skirtingLabor">Skirting Labor (₹ per running ft.)</label><input type="number" id="skirtingLabor" value="20" /></div>
            <div><label for="hackingLabor">Old Tile Removal (₹ per sq.ft.)</label><input type="number" id="hackingLabor" value="10" placeholder="0 if not applicable"/></div>
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
    tilePerSqFt: { economy: 40, mid: 75, premium: 120 },
    adhesivePerSqFt: { economy: 15, mid: 25, premium: 40 },
    skirtingTilePerRft: { economy: 25, mid: 40, premium: 60 },
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
    const areaNameInput = document.getElementById("areaName");
    const name = areaNameInput.value.trim() || `Area ${areas.length + 1}`;
    areas.push({
      id: `area-${Date.now()}`,
      name,
      length: 10,
      width: 10,
      skirtingRft: 40,
    });
    areaNameInput.value = "";
    renderAreas();
  }

  function renderAreas() {
    const areaContainer = document.getElementById("area-container");
    areaContainer.innerHTML = areas
      .map(
        (area) => `
                        <div id="${area.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${area.name}</h3>
                                <button type="button" class="remove-item-btn" data-id="${
                                  area.id
                                }">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-size: 0.875rem; @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); align-items: end; }">
                                <div class="input-group"><label>Length (ft)</label><input type="number" class="area-input" data-id="${
                                  area.id
                                }" data-prop="length" value="${
          area.length
        }" style="padding: 0.5rem;"></div>
                                <div class="input-group"><label>Width / Height (ft)</label><input type="number" class="area-input" data-id="${
                                  area.id
                                }" data-prop="width" value="${
          area.width
        }" style="padding: 0.5rem;"></div>
                                <div class="input-group"><label>Skirting (running ft)</label><input type="number" class="area-input" data-id="${
                                  area.id
                                }" data-prop="skirtingRft" value="${
          area.skirtingRft
        }" placeholder="0 if none" style="padding: 0.5rem;"></div>
                                <div class="input-group"><label><strong>Area (sq.ft.)</strong></label><input type="number" value="${
                                  area.length * area.width
                                }" disabled style="background:#eef2ff; font-weight:bold; padding: 0.5rem;"></div>
                            </div>
                        </div>`
      )
      .join("");
  }

  function updateArea(areaId, prop, value) {
    const area = areas.find((a) => a.id === areaId);
    if (area) {
      area[prop] = parseFloat(value) || 0;
      renderAreas();
    }
  }

  function removeArea(areaId) {
    areas = areas.filter((a) => a.id !== areaId);
    renderAreas();
  }

  function calculateBudget(e) {
    e.preventDefault();
    const quality = document.querySelector(
      'input[name="tileQuality"]:checked'
    ).value;
    const wastagePercent =
      parseFloat(document.getElementById("wastage").value) || 0;
    const tilingLabor =
      parseFloat(document.getElementById("tilingLabor").value) || 0;
    const skirtingLabor =
      parseFloat(document.getElementById("skirtingLabor").value) || 0;
    const hackingLabor =
      parseFloat(document.getElementById("hackingLabor").value) || 0;
    let totalArea = 0,
      totalSkirtingRft = 0;
    areas.forEach((a) => {
      totalArea += a.length * a.width;
      totalSkirtingRft += a.skirtingRft;
    });
    const areaWithWastage = totalArea * (1 + wastagePercent / 100);
    const tileCost = areaWithWastage * costData.tilePerSqFt[quality];
    const adhesiveCost = totalArea * costData.adhesivePerSqFt[quality];
    const skirtingMaterialCost =
      totalSkirtingRft * costData.skirtingTilePerRft[quality];
    const totalMaterialCost = tileCost + adhesiveCost + skirtingMaterialCost;
    const tilingLaborCost = totalArea * tilingLabor;
    const skirtingLaborCost = totalSkirtingRft * skirtingLabor;
    const hackingLaborCost = totalArea * hackingLabor;
    const totalLaborCost =
      tilingLaborCost + skirtingLaborCost + hackingLaborCost;
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      totalArea,
      tileCost,
      adhesiveCost,
      skirtingMaterialCost,
      tilingLaborCost,
      skirtingLaborCost,
      hackingLaborCost,
      // Data for saving
      inputs: {
        areas: [...areas],
        quality,
        wastagePercent,
        tilingLabor,
        skirtingLabor,
        hackingLabor,
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
                                        <div class="summary-item summary-item-total"><span>Total Tiling Area:</span><span id="totalArea">${data.totalArea.toFixed(
                                          2
                                        )} sq.ft.</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Cost Breakdown</h3>
                                <div id="detailed-breakdown">
                                    <div class="summary-item"><span>Tile Cost (with wastage):</span> <span>₹${Math.round(
                                      data.tileCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Adhesive, Grout etc.:</span> <span>₹${Math.round(
                                      data.adhesiveCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Skirting Material Cost:</span> <span>₹${Math.round(
                                      data.skirtingMaterialCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item" style="margin-top:0.5rem; border-top:1px solid #eee; padding-top:0.5rem;"><span>Tiling Labor Cost:</span> <span>₹${Math.round(
                                      data.tilingLaborCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Skirting Labor Cost:</span> <span>₹${Math.round(
                                      data.skirtingLaborCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Hacking / Removal Cost:</span> <span>₹${Math.round(
                                      data.hackingLaborCost
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
        "My Flooring Project"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          {
            id: `task_${Date.now() + 1}`,
            text: "Finalize tile selection",
            done: false,
          },
          {
            id: `task_${Date.now() + 2}`,
            text: "Hire tiling contractor",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Purchase tiles and adhesive",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Ensure floor leveling is done",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Start tiling work",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Flooring",
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
            backgroundColor: ["#0d9488", "#f97316"],
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

  const addAreaBtn = document.getElementById("addAreaBtn");
  const areaContainer = document.getElementById("area-container");
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
  addAreaBtn.addEventListener("click", addArea);
  document
    .getElementById("tileForm")
    .addEventListener("submit", calculateBudget);
  areaContainer.addEventListener("change", (e) => {
    if (e.target.matches(".area-input"))
      updateArea(e.target.dataset.id, e.target.dataset.prop, e.target.value);
  });
  areaContainer.addEventListener("click", (e) => {
    if (e.target.matches(".remove-item-btn")) removeArea(e.target.dataset.id);
  });
  addArea();
  updateStepVisibility();
};

