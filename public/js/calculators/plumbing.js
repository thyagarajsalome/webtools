
// This file exports the template and init logic for the Plumbing calculator

export const template = `
<div class="calculator-header">
    <h1>Plumbing Budget Calculator</h1>
    <p>Estimate the complete plumbing and sanitary cost for your new Indian home.</p>
</div>
<form id="plumbingForm">
    <div class="step-navigation">
        <button id="step-btn-1" class="step-btn active">1. Fixtures</button>
        <button id="step-btn-2" class="step-btn">2. Quality</button>
        <button id="step-btn-3" class="step-btn">3. Labor</button>
    </div>
    <div id="step-1" class="step active">
        <h2>Define Fixture Points</h2>
        <p>Add each bathroom and kitchen, and specify the number of fixture points in each.</p>
        <div id="fixture-container"></div>
        <div style="display: flex; gap: 1rem; align-items: end; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
            <button type="button" id="addBathroomBtn" class="btn btn-primary">Add Bathroom</button>
            <button type="button" id="addKitchenBtn" class="btn btn-primary">Add Kitchen</button>
        </div>
    </div>
    <div id="step-2" class="step">
        <h2>Pipes & Fixture Quality</h2>
        <p>Choose the quality of pipes and sanitary ware. This is a major cost factor.</p>
        <div class="quality-grid">
            <label class="quality-option"><input type="radio" name="materialQuality" value="economy" class="sr-only" checked /><h3>Economy</h3><p>Standard PVC/CPVC, Basic Fittings</p></label>
            <label class="quality-option"><input type="radio" name="materialQuality" value="mid" class="sr-only" /><h3>Mid-Range</h3><p>Branded CPVC (Ashirvad), Hindware/Cera</p></label>
            <label class="quality-option"><input type="radio" name="materialQuality" value="premium" class="sr-only" /><h3>Premium</h3><p>Premium Pipes (Astral), Jaquar/Kohler</p></label>
        </div>
        <div class="form-grid" style="margin-top: 1.5rem">
            <div><label for="houseArea">Total Built-up Area (for main lines)</label><input type="number" id="houseArea" placeholder="e.g., 1200 sq.ft." /></div>
        </div>
    </div>
    <div id="step-3" class="step">
        <h2>Labor Cost Estimation</h2>
        <p>Costs vary by city. Enter the rates for your area.</p>
        <div class="form-grid">
            <div><label for="laborPerPoint">Labor Rate per Fixture Point (₹)</label><input type="number" id="laborPerPoint" value="1500" /></div>
            <div><label for="mainlineLabor">Main Line & Drainage Labor (Lumpsum ₹)</label><input type="number" id="mainlineLabor" value="15000" /></div>
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
    fixtureSets = [],
    chartInstance = null;
  const costData = {
    perPoint: {
      wc: { economy: 7000, mid: 12000, premium: 25000 },
      basin: { economy: 3500, mid: 6000, premium: 12000 },
      shower: { economy: 4000, mid: 8000, premium: 18000 },
      tap: { economy: 1500, mid: 2500, premium: 5000 },
      kitchenSink: { economy: 5000, mid: 9000, premium: 20000 },
      geyser: { economy: 1000, mid: 1500, premium: 2500 },
    },
    commonMaterialsPerSqFt: { economy: 20, mid: 35, premium: 60 },
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

  function addFixtureSet(type) {
    const id = `fixture-${Date.now()}`;
    const count = fixtureSets.filter((f) => f.type === type).length + 1;
    const name = `${type} ${count}`;
    const newSet = {
      id,
      name,
      type,
      wc: 0,
      basin: 0,
      shower: 0,
      tap: 0,
      kitchenSink: 0,
      geyser: 0,
    };
    if (type === "Bathroom") {
      newSet.wc = 1;
      newSet.basin = 1;
      newSet.shower = 1;
      newSet.tap = 1;
      newSet.geyser = 1;
    } else {
      newSet.kitchenSink = 1;
      newSet.tap = 1;
    }
    fixtureSets.push(newSet);
    renderFixtures();
  }

  function createInput(name, label, id, value, type) {
    const isApplicable =
      (type === "Bathroom" &&
        ["wc", "basin", "shower", "geyser"].includes(name)) ||
      (type === "Kitchen" && name === "kitchenSink") ||
      name === "tap";
    if (!isApplicable && value === 0) return "<div></div>";
    return `<div class="input-group"><label>${label}</label><input type="number" class="fixture-input" data-id="${id}" data-prop="${name}" value="${value}" style="padding: 0.5rem; width: 70px; text-align: center;"></div>`;
  }

  function renderFixtures() {
    const fixtureContainer = document.getElementById("fixture-container");
    fixtureContainer.innerHTML = fixtureSets
      .map(
        (set) => `
                        <div id="${set.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${set.name}</h3>
                                <button type="button" class="remove-item-btn" data-id="${
                                  set.id
                                }">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.875rem; @media (min-width: 768px) { grid-template-columns: repeat(6, 1fr); }">
                                ${createInput(
                                  "wc",
                                  "WC",
                                  set.id,
                                  set.wc,
                                  set.type
                                )}
                                ${createInput(
                                  "basin",
                                  "Basins",
                                  set.id,
                                  set.basin,
                                  set.type
                                )}
                                ${createInput(
                                  "shower",
                                  "Showers",
                                  set.id,
                                  set.shower,
                                  set.type
                                )}
                                ${createInput(
                                  "tap",
                                  "Taps",
                                  set.id,
                                  set.tap,
                                  set.type
                                )}
                                ${createInput(
                                  "kitchenSink",
                                  "Kitchen Sinks",
                                  set.id,
                                  set.kitchenSink,
                                  set.type
                                )}
                                ${createInput(
                                  "geyser",
                                  "Geyser Pts",
                                  set.id,
                                  set.geyser,
                                  set.type
                                )}
                            </div>
                        </div>`
      )
      .join("");
  }

  function updateFixtureData(id, prop, value) {
    const set = fixtureSets.find((f) => f.id === id);
    if (set) set[prop] = parseInt(value, 10) || 0;
  }

  function removeFixture(id) {
    fixtureSets = fixtureSets.filter((f) => f.id !== id);
    renderFixtures();
  }

  function calculateBudget(e) {
    e.preventDefault();
    const quality = document.querySelector(
      'input[name="materialQuality"]:checked'
    ).value;
    const houseArea =
      parseFloat(document.getElementById("houseArea").value) || 0;
    const laborPerPoint =
      parseFloat(document.getElementById("laborPerPoint").value) || 0;
    const mainlineLabor =
      parseFloat(document.getElementById("mainlineLabor").value) || 0;
    const totals = fixtureSets.reduce(
      (acc, set) => {
        acc.wc += set.wc;
        acc.basin += set.basin;
        acc.shower += set.shower;
        acc.tap += set.tap;
        acc.kitchenSink += set.kitchenSink;
        acc.geyser += set.geyser;
        return acc;
      },
      { wc: 0, basin: 0, shower: 0, tap: 0, kitchenSink: 0, geyser: 0 }
    );
    const pointCosts = {
      wc: totals.wc * costData.perPoint.wc[quality],
      basin: totals.basin * costData.perPoint.basin[quality],
      shower: totals.shower * costData.perPoint.shower[quality],
      tap: totals.tap * costData.perPoint.tap[quality],
      kitchenSink: totals.kitchenSink * costData.perPoint.kitchenSink[quality],
      geyser: totals.geyser * costData.perPoint.geyser[quality],
    };
    const totalFixtureMaterialCost = Object.values(pointCosts).reduce(
      (sum, cost) => sum + cost,
      0
    );
    const commonMaterialCost =
      houseArea * costData.commonMaterialsPerSqFt[quality];
    const totalMaterialCost = totalFixtureMaterialCost + commonMaterialCost;
    const totalPoints = Object.values(totals).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalLaborCost = totalPoints * laborPerPoint + mainlineLabor;
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      totalPoints,
      pointCosts,
      commonMaterialCost,
      // Data for saving
      inputs: {
        fixtureSets: [...fixtureSets],
        quality,
        houseArea,
        laborPerPoint,
        mainlineLabor,
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
                                        <div class="summary-item summary-item-total"><span>Total Fixture Points:</span><span id="totalPoints">${
                                          data.totalPoints
                                        }</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Cost Breakdown</h3>
                                <div id="detailed-breakdown">
                                    <div class="summary-item"><span>Sanitary & CP Fittings Cost:</span> <span>₹${Math.round(
                                      Object.values(data.pointCosts).reduce(
                                        (s, c) => s + c,
                                        0
                                      )
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Main Pipes & Drainage:</span> <span>₹${Math.round(
                                      data.commonMaterialCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item" style="margin-top:0.5rem; border-top:1px solid #eee; padding-top:0.5rem;"><span>Total Labor Cost:</span> <span>₹${Math.round(
                                      data.totalLaborCost
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
        "My Plumbing Project"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          { id: `task_${Date.now() + 1}`, text: "Hire a plumber", done: false },
          {
            id: `task_${Date.now() + 2}`,
            text: "Get 3 quotes for fittings",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Buy all pipes and fittings",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Install bathroom waterproofing",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Install all fixtures",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Plumbing",
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
            backgroundColor: ["#3b82f6", "#16a34a"],
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

  document
    .getElementById("addBathroomBtn")
    .addEventListener("click", () => addFixtureSet("Bathroom"));
  document
    .getElementById("addKitchenBtn")
    .addEventListener("click", () => addFixtureSet("Kitchen"));
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
    .getElementById("plumbingForm")
    .addEventListener("submit", calculateBudget);
  const fixtureContainer = document.getElementById("fixture-container");
  fixtureContainer.addEventListener("change", (e) => {
    if (e.target.matches(".fixture-input"))
      updateFixtureData(
        e.target.dataset.id,
        e.target.dataset.prop,
        e.target.value
      );
  });
  fixtureContainer.addEventListener("click", (e) => {
    if (e.target.matches(".remove-item-btn"))
      removeFixture(e.target.dataset.id);
  });

  addFixtureSet("Bathroom");
  updateStepVisibility();
};

// This file exports the template and init logic for the Plumbing calculator



export const init = function (db, showToast, shareResults, showInstallPrompt) {
  let currentStep = 1,
    totalSteps = 3,
    fixtureSets = [],
    chartInstance = null;
  const costData = {
    perPoint: {
      wc: { economy: 7000, mid: 12000, premium: 25000 },
      basin: { economy: 3500, mid: 6000, premium: 12000 },
      shower: { economy: 4000, mid: 8000, premium: 18000 },
      tap: { economy: 1500, mid: 2500, premium: 5000 },
      kitchenSink: { economy: 5000, mid: 9000, premium: 20000 },
      geyser: { economy: 1000, mid: 1500, premium: 2500 },
    },
    commonMaterialsPerSqFt: { economy: 20, mid: 35, premium: 60 },
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

  function addFixtureSet(type) {
    const id = `fixture-${Date.now()}`;
    const count = fixtureSets.filter((f) => f.type === type).length + 1;
    const name = `${type} ${count}`;
    const newSet = {
      id,
      name,
      type,
      wc: 0,
      basin: 0,
      shower: 0,
      tap: 0,
      kitchenSink: 0,
      geyser: 0,
    };
    if (type === "Bathroom") {
      newSet.wc = 1;
      newSet.basin = 1;
      newSet.shower = 1;
      newSet.tap = 1;
      newSet.geyser = 1;
    } else {
      newSet.kitchenSink = 1;
      newSet.tap = 1;
    }
    fixtureSets.push(newSet);
    renderFixtures();
  }

  function createInput(name, label, id, value, type) {
    const isApplicable =
      (type === "Bathroom" &&
        ["wc", "basin", "shower", "geyser"].includes(name)) ||
      (type === "Kitchen" && name === "kitchenSink") ||
      name === "tap";
    if (!isApplicable && value === 0) return "<div></div>";
    return `<div class="input-group"><label>${label}</label><input type="number" class="fixture-input" data-id="${id}" data-prop="${name}" value="${value}" style="padding: 0.5rem; width: 70px; text-align: center;"></div>`;
  }

  function renderFixtures() {
    const fixtureContainer = document.getElementById("fixture-container");
    fixtureContainer.innerHTML = fixtureSets
      .map(
        (set) => `
                        <div id="${set.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${set.name}</h3>
                                <button type="button" class="remove-item-btn" data-id="${
                                  set.id
                                }">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.875rem; @media (min-width: 768px) { grid-template-columns: repeat(6, 1fr); }">
                                ${createInput(
                                  "wc",
                                  "WC",
                                  set.id,
                                  set.wc,
                                  set.type
                                )}
                                ${createInput(
                                  "basin",
                                  "Basins",
                                  set.id,
                                  set.basin,
                                  set.type
                                )}
                                ${createInput(
                                  "shower",
                                  "Showers",
                                  set.id,
                                  set.shower,
                                  set.type
                                )}
                                ${createInput(
                                  "tap",
                                  "Taps",
                                  set.id,
                                  set.tap,
                                  set.type
                                )}
                                ${createInput(
                                  "kitchenSink",
                                  "Kitchen Sinks",
                                  set.id,
                                  set.kitchenSink,
                                  set.type
                                )}
                                ${createInput(
                                  "geyser",
                                  "Geyser Pts",
                                  set.id,
                                  set.geyser,
                                  set.type
                                )}
                            </div>
                        </div>`
      )
      .join("");
  }

  function updateFixtureData(id, prop, value) {
    const set = fixtureSets.find((f) => f.id === id);
    if (set) set[prop] = parseInt(value, 10) || 0;
  }

  function removeFixture(id) {
    fixtureSets = fixtureSets.filter((f) => f.id !== id);
    renderFixtures();
  }

  function calculateBudget(e) {
    e.preventDefault();
    const quality = document.querySelector(
      'input[name="materialQuality"]:checked'
    ).value;
    const houseArea =
      parseFloat(document.getElementById("houseArea").value) || 0;
    const laborPerPoint =
      parseFloat(document.getElementById("laborPerPoint").value) || 0;
    const mainlineLabor =
      parseFloat(document.getElementById("mainlineLabor").value) || 0;
    const totals = fixtureSets.reduce(
      (acc, set) => {
        acc.wc += set.wc;
        acc.basin += set.basin;
        acc.shower += set.shower;
        acc.tap += set.tap;
        acc.kitchenSink += set.kitchenSink;
        acc.geyser += set.geyser;
        return acc;
      },
      { wc: 0, basin: 0, shower: 0, tap: 0, kitchenSink: 0, geyser: 0 }
    );
    const pointCosts = {
      wc: totals.wc * costData.perPoint.wc[quality],
      basin: totals.basin * costData.perPoint.basin[quality],
      shower: totals.shower * costData.perPoint.shower[quality],
      tap: totals.tap * costData.perPoint.tap[quality],
      kitchenSink: totals.kitchenSink * costData.perPoint.kitchenSink[quality],
      geyser: totals.geyser * costData.perPoint.geyser[quality],
    };
    const totalFixtureMaterialCost = Object.values(pointCosts).reduce(
      (sum, cost) => sum + cost,
      0
    );
    const commonMaterialCost =
      houseArea * costData.commonMaterialsPerSqFt[quality];
    const totalMaterialCost = totalFixtureMaterialCost + commonMaterialCost;
    const totalPoints = Object.values(totals).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalLaborCost = totalPoints * laborPerPoint + mainlineLabor;
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      totalPoints,
      pointCosts,
      commonMaterialCost,
      // Data for saving
      inputs: {
        fixtureSets: [...fixtureSets],
        quality,
        houseArea,
        laborPerPoint,
        mainlineLabor,
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
                                        <div class="summary-item summary-item-total"><span>Total Fixture Points:</span><span id="totalPoints">${
                                          data.totalPoints
                                        }</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Cost Breakdown</h3>
                                <div id="detailed-breakdown">
                                    <div class="summary-item"><span>Sanitary & CP Fittings Cost:</span> <span>₹${Math.round(
                                      Object.values(data.pointCosts).reduce(
                                        (s, c) => s + c,
                                        0
                                      )
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item"><span>Main Pipes & Drainage:</span> <span>₹${Math.round(
                                      data.commonMaterialCost
                                    ).toLocaleString("en-IN")}</span></div>
                                    <div class="summary-item" style="margin-top:0.5rem; border-top:1px solid #eee; padding-top:0.5rem;"><span>Total Labor Cost:</span> <span>₹${Math.round(
                                      data.totalLaborCost
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
        "My Plumbing Project"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          { id: `task_${Date.now() + 1}`, text: "Hire a plumber", done: false },
          {
            id: `task_${Date.now() + 2}`,
            text: "Get 3 quotes for fittings",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Buy all pipes and fittings",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Install bathroom waterproofing",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Install all fixtures",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Plumbing",
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
            backgroundColor: ["#3b82f6", "#16a34a"],
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

  document
    .getElementById("addBathroomBtn")
    .addEventListener("click", () => addFixtureSet("Bathroom"));
  document
    .getElementById("addKitchenBtn")
    .addEventListener("click", () => addFixtureSet("Kitchen"));
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
    .getElementById("plumbingForm")
    .addEventListener("submit", calculateBudget);
  const fixtureContainer = document.getElementById("fixture-container");
  fixtureContainer.addEventListener("change", (e) => {
    if (e.target.matches(".fixture-input"))
      updateFixtureData(
        e.target.dataset.id,
        e.target.dataset.prop,
        e.target.value
      );
  });
  fixtureContainer.addEventListener("click", (e) => {
    if (e.target.matches(".remove-item-btn"))
      removeFixture(e.target.dataset.id);
  });

  addFixtureSet("Bathroom");
  updateStepVisibility();
};

