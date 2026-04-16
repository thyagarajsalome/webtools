
// This file exports the template and init logic for the House Construction calculator

export const template = `
<div class="calculator-header"><h1>House Construction Cost Estimator</h1></div>
<form id="constructionForm">
  <div class="step-navigation">
    <button id="step-btn-1" class="step-btn active">1. Area</button>
    <button id="step-btn-2" class="step-btn">2. Quality</button>
    <button id="step-btn-3" class="step-btn">3. Other</button>
  </div>
  <div id="step-1" class="step active">
    <h2>Plot & Built-up Area</h2><p>Enter the total plot area and the desired built-up area for your house.</p>
    <div class="form-grid">
      <div><label for="plotArea">Plot Area (sq.ft.)</label><input type="number" id="plotArea" value="1200" /></div>
      <div><label for="builtUpArea">Total Built-up Area (sq.ft.)</label><input type="number" id="builtUpArea" value="2000" /></div>
      <div><label for="numFloors">Number of Floors</label><input type="number" id="numFloors" value="2" /></div>
    </div>
  </div>
  <div id="step-2" class="step">
    <h2>Construction Quality</h2><p>Select the desired quality. This determines the per square foot rate.</p>
    <div class="quality-grid">
      <label class="quality-option"><input type="radio" name="constructionQuality" value="basic" class="sr-only" checked /><h3>Basic</h3><p>Approx. ₹1,600 / sq.ft.</p></label>
      <label class="quality-option"><input type="radio" name="constructionQuality" value="mid" class="sr-only" /><h3>Mid-Range</h3><p>Approx. ₹1,900 / sq.ft.</p></label>
      <label class="quality-option"><input type="radio" name="constructionQuality" value="premium" class="sr-only" /><h3>Premium</h3><p>Approx. ₹2,400 / sq.ft.</p></label>
    </div>
  </div>
  <div id="step-3" class="step">
    <h2>Additional Costs (Optional)</h2><p>Include costs for permissions, architect fees, and utilities.</p>
    <div class="form-grid">
      <div><label for="permissionFees">Permission & Approval Fees (₹)</label><input type="number" id="permissionFees" value="80000" /></div>
      <div><label for="architectFees">Architect Fees (%)</label><input type="number" id="architectFees" value="8" /></div>
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
    chartInstance = null;
  const costData = {
    perSqFtRate: { basic: 1600, mid: 1900, premium: 2400 },
    breakdownPercentage: {
      foundation: 0.15,
      structure: 0.3,
      finishing: 0.25,
      doorsWindows: 0.1,
      electricalPlumbing: 0.15,
      misc: 0.05,
    },
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

  function calculateBudget(e) {
    e.preventDefault();
    const builtUpArea =
      parseFloat(document.getElementById("builtUpArea").value) || 0;
    const quality = document.querySelector(
      'input[name="constructionQuality"]:checked'
    ).value;
    const permissionFees =
      parseFloat(document.getElementById("permissionFees").value) || 0;
    const architectFeePercent =
      parseFloat(document.getElementById("architectFees").value) || 0;
    const rate = costData.perSqFtRate[quality];
    const baseConstructionCost = builtUpArea * rate;
    const breakdown = {};
    for (const stage in costData.breakdownPercentage) {
      breakdown[stage] =
        baseConstructionCost * costData.breakdownPercentage[stage];
    }
    const architectFees = baseConstructionCost * (architectFeePercent / 100);
    const grandTotal = baseConstructionCost + permissionFees + architectFees;
    displayResults({
      grandTotal,
      baseConstructionCost,
      breakdown,
      permissionFees,
      architectFees,
      // Data for saving
      inputs: {
        builtUpArea,
        quality,
        permissionFees,
        architectFeePercent,
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
                            <div class="summary-item"><span>Base Construction Cost:</span><span>₹${Math.round(
                              data.baseConstructionCost
                            ).toLocaleString("en-IN")}</span></div>
                            <div class="summary-item"><span>Architect & Approval Fees:</span><span>₹${Math.round(
                              data.architectFees + data.permissionFees
                            ).toLocaleString("en-IN")}</span></div>
                        </div>
                    </div>
                </div>
                <div class="detailed-breakdown-container">
                    <h3>Construction Stage Breakdown</h3>
                    ${Object.entries(data.breakdown)
                      .map(
                        ([key, value]) =>
                          `<div class="summary-item"><span style="text-transform: capitalize;">${key.replace(
                            /([A-Z])/g,
                            " $1"
                          )}</span><span>₹${Math.round(value).toLocaleString(
                            "en-IN"
                          )}</span></div>`
                      )
                      .join("")}
                </div>
            </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    // --- UPDATED: Save Button Logic ---
    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this project:",
        "My House Construction"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          {
            id: `task_${Date.now() + 1}`,
            text: "Finalize architect plans",
            done: false,
          },
          {
            id: `task_${Date.now() + 2}`,
            text: "Get municipal approvals",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Hire main contractor",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Get quotes for foundation",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Start foundation work",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "House Construction",
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
    const chartLabels = Object.keys(data.breakdown).map((k) =>
      k.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );
    const chartData = Object.values(data.breakdown);
    renderChart(chartLabels, chartData);
  }

  function renderChart(labels, data) {
    const ctx = document.getElementById("costChart")?.getContext("2d");
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#A52A2A",
              "#808080",
              "#ADD8E6",
              "#DEB887",
              "#4682B4",
              "#C0C0C0",
            ],
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
            labels: { padding: 20, font: { size: 12 } },
          },
        },
      },
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
    .getElementById("constructionForm")
    .addEventListener("submit", calculateBudget);
  updateStepVisibility();
};

// This file exports the template and init logic for the House Construction calculator

export const template = `
<div class="calculator-header"><h1>House Construction Cost Estimator</h1></div>
<form id="constructionForm">
  <div class="step-navigation">
    <button id="step-btn-1" class="step-btn active">1. Area</button>
    <button id="step-btn-2" class="step-btn">2. Quality</button>
    <button id="step-btn-3" class="step-btn">3. Other</button>
  </div>
  <div id="step-1" class="step active">
    <h2>Plot & Built-up Area</h2><p>Enter the total plot area and the desired built-up area for your house.</p>
    <div class="form-grid">
      <div><label for="plotArea">Plot Area (sq.ft.)</label><input type="number" id="plotArea" value="1200" /></div>
      <div><label for="builtUpArea">Total Built-up Area (sq.ft.)</label><input type="number" id="builtUpArea" value="2000" /></div>
      <div><label for="numFloors">Number of Floors</label><input type="number" id="numFloors" value="2" /></div>
    </div>
  </div>
  <div id="step-2" class="step">
    <h2>Construction Quality</h2><p>Select the desired quality. This determines the per square foot rate.</p>
    <div class="quality-grid">
      <label class="quality-option"><input type="radio" name="constructionQuality" value="basic" class="sr-only" checked /><h3>Basic</h3><p>Approx. ₹1,600 / sq.ft.</p></label>
      <label class="quality-option"><input type="radio" name="constructionQuality" value="mid" class="sr-only" /><h3>Mid-Range</h3><p>Approx. ₹1,900 / sq.ft.</p></label>
      <label class="quality-option"><input type="radio" name="constructionQuality" value="premium" class="sr-only" /><h3>Premium</h3><p>Approx. ₹2,400 / sq.ft.</p></label>
    </div>
  </div>
  <div id="step-3" class="step">
    <h2>Additional Costs (Optional)</h2><p>Include costs for permissions, architect fees, and utilities.</p>
    <div class="form-grid">
      <div><label for="permissionFees">Permission & Approval Fees (₹)</label><input type="number" id="permissionFees" value="80000" /></div>
      <div><label for="architectFees">Architect Fees (%)</label><input type="number" id="architectFees" value="8" /></div>
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
    chartInstance = null;
  const costData = {
    perSqFtRate: { basic: 1600, mid: 1900, premium: 2400 },
    breakdownPercentage: {
      foundation: 0.15,
      structure: 0.3,
      finishing: 0.25,
      doorsWindows: 0.1,
      electricalPlumbing: 0.15,
      misc: 0.05,
    },
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

  function calculateBudget(e) {
    e.preventDefault();
    const builtUpArea =
      parseFloat(document.getElementById("builtUpArea").value) || 0;
    const quality = document.querySelector(
      'input[name="constructionQuality"]:checked'
    ).value;
    const permissionFees =
      parseFloat(document.getElementById("permissionFees").value) || 0;
    const architectFeePercent =
      parseFloat(document.getElementById("architectFees").value) || 0;
    const rate = costData.perSqFtRate[quality];
    const baseConstructionCost = builtUpArea * rate;
    const breakdown = {};
    for (const stage in costData.breakdownPercentage) {
      breakdown[stage] =
        baseConstructionCost * costData.breakdownPercentage[stage];
    }
    const architectFees = baseConstructionCost * (architectFeePercent / 100);
    const grandTotal = baseConstructionCost + permissionFees + architectFees;
    displayResults({
      grandTotal,
      baseConstructionCost,
      breakdown,
      permissionFees,
      architectFees,
      // Data for saving
      inputs: {
        builtUpArea,
        quality,
        permissionFees,
        architectFeePercent,
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
                            <div class="summary-item"><span>Base Construction Cost:</span><span>₹${Math.round(
                              data.baseConstructionCost
                            ).toLocaleString("en-IN")}</span></div>
                            <div class="summary-item"><span>Architect & Approval Fees:</span><span>₹${Math.round(
                              data.architectFees + data.permissionFees
                            ).toLocaleString("en-IN")}</span></div>
                        </div>
                    </div>
                </div>
                <div class="detailed-breakdown-container">
                    <h3>Construction Stage Breakdown</h3>
                    ${Object.entries(data.breakdown)
                      .map(
                        ([key, value]) =>
                          `<div class="summary-item"><span style="text-transform: capitalize;">${key.replace(
                            /([A-Z])/g,
                            " $1"
                          )}</span><span>₹${Math.round(value).toLocaleString(
                            "en-IN"
                          )}</span></div>`
                      )
                      .join("")}
                </div>
            </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    // --- UPDATED: Save Button Logic ---
    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this project:",
        "My House Construction"
      );
      if (name) {
        // --- NEW: Default checklist for this project type ---
        const defaultTasks = [
          {
            id: `task_${Date.now() + 1}`,
            text: "Finalize architect plans",
            done: false,
          },
          {
            id: `task_${Date.now() + 2}`,
            text: "Get municipal approvals",
            done: false,
          },
          {
            id: `task_${Date.now() + 3}`,
            text: "Hire main contractor",
            done: false,
          },
          {
            id: `task_${Date.now() + 4}`,
            text: "Get quotes for foundation",
            done: false,
          },
          {
            id: `task_${Date.now() + 5}`,
            text: "Start foundation work",
            done: false,
          },
        ];

        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "House Construction",
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
    const chartLabels = Object.keys(data.breakdown).map((k) =>
      k.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );
    const chartData = Object.values(data.breakdown);
    renderChart(chartLabels, chartData);
  }

  function renderChart(labels, data) {
    const ctx = document.getElementById("costChart")?.getContext("2d");
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#A52A2A",
              "#808080",
              "#ADD8E6",
              "#DEB887",
              "#4682B4",
              "#C0C0C0",
            ],
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
            labels: { padding: 20, font: { size: 12 } },
          },
        },
      },
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
    .getElementById("constructionForm")
    .addEventListener("submit", calculateBudget);
  updateStepVisibility();
};
