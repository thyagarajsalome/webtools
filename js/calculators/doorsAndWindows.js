// This file exports the template and init logic for the Doors & Windows calculator

export const template = `
<div class="calculator-header"><h1>Doors & Windows Budget Calculator</h1></div>
<form id="dwForm">
    <div class="step-navigation">
        <button id="step-btn-1" class="step-btn active">1. Openings</button>
        <button id="step-btn-2" class="step-btn">2. Materials</button>
        <button id="step-btn-3" class="step-btn">3. Labor</button>
    </div>
    <div id="step-1" class="step active">
        <h2>Define Openings & Visualize</h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }">
            <div>
                <p>Add each door and window and provide its dimensions in feet.</p>
                <div id="openings-container"></div>
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; align-items: end; border-top: 1px solid var(--border-color); padding-top: 1.5rem; margin-top: 1.5rem;">
                    <div><label for="openingName">Opening Name</label><input type="text" id="openingName" placeholder="e.g., Main Door" /></div>
                    <button type="button" id="addOpeningBtn" class="btn btn-primary">Add Opening</button>
                </div>
            </div>
            <div style="background-color: var(--brand-color-light); border-radius: var(--border-radius-lg); padding: 1rem; display: flex; align-items: center; justify-content: center; min-height: 300px;">
                <canvas id="visualizerCanvas" width="300" height="300"></canvas>
            </div>
        </div>
    </div>
    <div id="step-2" class="step">
            <h2>Frame & Shutter Materials</h2><p>Select the material type. Costs are indicative per square foot.</p>
        <div class="quality-grid">
            <label class="quality-option"><input type="radio" name="materialQuality" value="teak" class="sr-only" checked /><h3>Teak Wood</h3><p>₹1800 - ₹2500 / sq.ft.</p></label>
            <label class="quality-option"><input type="radio" name="materialQuality" value="wood" class="sr-only" /><h3>Other Hard Wood</h3><p>₹1200 - ₹1800 / sq.ft.</p></label>
            <label class="quality-option"><input type="radio" name="materialQuality" value="upvc" class="sr-only" /><h3>UPVC</h3><p>₹600 - ₹1200 / sq.ft.</p></label>
            <label class="quality-option"><input type="radio" name="materialQuality" value="aluminium" class="sr-only" /><h3>Aluminium</h3><p>₹500 - ₹900 / sq.ft.</p></label>
        </div>
    </div>
    <div id="step-3" class="step">
        <h2>Labor & Installation Costs</h2><p>Enter local labor rates for installation and frame fitting.</p>
            <div class="form-grid">
            <div><label for="installationLabor">Installation Labor (₹ per sq.ft.)</label><input type="number" id="installationLabor" value="150" /></div>
            <div><label for="frameLabor">Granite Frame Labor (₹ per running ft.)</label><input type="number" id="frameLabor" value="120" placeholder="0 if not applicable"/></div>
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
    openings = [],
    chartInstance = null;
  const canvas = document.getElementById("visualizerCanvas");
  const ctx = canvas?.getContext("2d");

  const costData = {
    materialPerSqFt: {
      teak: 2200,
      wood: 1500,
      upvc: 900,
      aluminium: 700,
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

  function addOpening() {
    const nameInput = document.getElementById("openingName");
    const name = nameInput.value.trim() || `Opening ${openings.length + 1}`;
    const newOpening = {
      id: `opening-${Date.now()}`,
      name,
      width: 3,
      height: 7,
      frameRft: 20,
    };
    openings.push(newOpening);
    nameInput.value = "";
    renderOpenings();
    drawVisualizer(newOpening);
  }

  function renderOpenings() {
    const openingsContainer = document.getElementById("openings-container");
    openingsContainer.innerHTML = openings
      .map(
        (op) => `
                        <div id="${op.id}" class="item-card">
                            <div class="item-card-header">
                                <h3>${op.name}</h3>
                                <button type="button" class="remove-item-btn" data-id="${op.id}">Remove</button>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                                <div><label>Width (ft)</label><input type="number" class="opening-input" data-id="${op.id}" data-prop="width" value="${op.width}" step="0.1"></div>
                                <div><label>Height (ft)</label><input type="number" class="opening-input" data-id="${op.id}" data-prop="height" value="${op.height}" step="0.1"></div>
                                <div><label>Frame (rft)</label><input type="number" class="opening-input" data-id="${op.id}" data-prop="frameRft" value="${op.frameRft}" step="0.1"></div>
                            </div>
                        </div>`
      )
      .join("");
  }

  function updateOpening(id, prop, value) {
    const opening = openings.find((o) => o.id === id);
    if (opening) {
      opening[prop] = parseFloat(value) || 0;
      drawVisualizer(opening);
    }
  }

  function removeOpening(id) {
    openings = openings.filter((o) => o.id !== id);
    renderOpenings();
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (openings.length > 0) drawVisualizer(openings[openings.length - 1]);
  }

  function drawVisualizer(opening) {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!opening) return;
    const PADDING = 20;
    const availableWidth = canvas.width - 2 * PADDING;
    const availableHeight = canvas.height - 2 * PADDING;
    const scale = Math.min(
      availableWidth / opening.width,
      availableHeight / opening.height
    );
    const rectWidth = opening.width * scale;
    const rectHeight = opening.height * scale;
    const x = (canvas.width - rectWidth) / 2;
    const y = (canvas.height - rectHeight) / 2;
    const rootStyles = getComputedStyle(document.documentElement);
    const brandColor = rootStyles.getPropertyValue("--brand-color").trim();
    const textColor = rootStyles.getPropertyValue("--text-primary").trim();
    ctx.strokeStyle = brandColor;
    ctx.fillStyle = "rgba(139, 92, 246, 0.1)";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, rectWidth, rectHeight);
    ctx.strokeRect(x, y, rectWidth, rectHeight);
    ctx.fillStyle = textColor;
    ctx.font = "14px Inter";
    ctx.textAlign = "center";
    ctx.fillText(
      `${opening.width} ft`,
      canvas.width / 2,
      y + rectHeight + PADDING - 5
    );
    ctx.save();
    ctx.translate(x - 10, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${opening.height} ft`, 0, 0);
    ctx.restore();
  }

  function calculateBudget(e) {
    e.preventDefault();
    const quality = document.querySelector(
      'input[name="materialQuality"]:checked'
    ).value;
    const installationLabor =
      parseFloat(document.getElementById("installationLabor").value) || 0;
    const frameLabor =
      parseFloat(document.getElementById("frameLabor").value) || 0;
    let totalMaterialCost = 0,
      totalLaborCost = 0,
      breakdown = "";
    openings.forEach((op) => {
      const area = op.width * op.height;
      const materialCost = area * costData.materialPerSqFt[quality];
      const installCost = area * installationLabor;
      const frameCost = op.frameRft * frameLabor;
      const itemTotal = materialCost + installCost + frameCost;
      totalMaterialCost += materialCost;
      totalLaborCost += installCost + frameCost;
      breakdown += `<div class="summary-item"><span>${op.name} (${op.width}'x${
        op.height
      }')</span> <span>₹${Math.round(itemTotal).toLocaleString(
        "en-IN"
      )}</span></div>`;
    });
    const grandTotal = totalMaterialCost + totalLaborCost;
    displayResults({
      grandTotal,
      totalMaterialCost,
      totalLaborCost,
      breakdown,
      // Data for saving
      inputs: {
        openings: [...openings],
        quality,
        installationLabor,
        frameLabor,
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
                                    </div>
                                </div>
                            </div>
                            <div class="detailed-breakdown-container">
                                <h3>Detailed Breakdown</h3>
                                <div id="detailed-breakdown">${
                                  data.breakdown
                                }</div>
                            </div>
                        </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this project:",
        "My Doors & Windows"
      );
      if (name) {
        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "Doors & Windows",
          total: data.grandTotal,
          data: data,
          savedOn: new Date().toISOString(),
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
            backgroundColor: ["#8b5cf6", "#10b981"],
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
  document.getElementById("dwForm").addEventListener("submit", calculateBudget);
  const openingsContainer = document.getElementById("openings-container");
  document
    .getElementById("addOpeningBtn")
    .addEventListener("click", addOpening);
  openingsContainer.addEventListener("change", (e) => {
    if (e.target.matches(".opening-input"))
      updateOpening(e.target.dataset.id, e.target.dataset.prop, e.target.value);
  });
  openingsContainer.addEventListener("click", (e) => {
    if (e.target.matches(".remove-item-btn"))
      removeOpening(e.target.dataset.id);
  });

  addOpening();
  updateStepVisibility();
};
