document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");

  const themeSwitcher = document.getElementById("theme-switcher");
  let deferredPrompt;

  // --- PWA Installation Logic ---

  // --- Theme Switcher Logic ---
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  themeSwitcher.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });

  const app = {
    templates: {
      home: `
              <div class="hero-section">
        <p>Your Dream Home, Budgeted Perfectly.</p>
        <p>
          <span>Stop guessing, start planning</span>. "Dream Home Calculator"
          provides transparent, detailed cost estimates for every stage of your
          home construction project.
        </p>
      </div>
             
                <div class="calculator-grid">
                    <a class="category-card calculator-link" href="#" data-page="houseConstruction">
                        <div class="icon-wrapper"><span class="material-symbols-outlined">home</span></div>
                        <p>House Construction</p>
                    </a>
                    <a class="category-card calculator-link" href="#" data-page="electrical">
                        <div class="icon-wrapper"><span class="material-symbols-outlined">electrical_services</span></div>
                        <p>Electrical</p>
                    </a>
                    <a class="category-card calculator-link" href="#" data-page="plumbing">
                        <div class="icon-wrapper"><span class="material-symbols-outlined">plumbing</span></div>
                        <p>Plumbing</p>
                    </a>
                    <a class="category-card calculator-link" href="#" data-page="flooring">
                        <div class="icon-wrapper"><span class="material-symbols-outlined">square_foot</span></div>
                        <p>Flooring</p>
                    </a>
                    <a class="category-card calculator-link" href="#" data-page="painting">
                        <div class="icon-wrapper"><span class="material-symbols-outlined">format_paint</span></div>
                        <p>Painting</p>
                    </a>
                    <a class="category-card calculator-link" href="#" data-page="doorsAndWindows">
                        <div class="icon-wrapper"><span class="material-symbols-outlined">door_front</span></div>
                        <p>Doors & Windows</p>
                    </a>
                </div>`,
      houseConstruction: `
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
                <section id="results" class="hidden"></section>`,
      painting: `
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
                <section id="results" class="hidden"></section>`,
      electrical: `
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
            `,
      plumbing: `
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
            `,
      flooring: `
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
            `,
      doorsAndWindows: `
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
            `,
    },
    calculators: {
      houseConstruction: {
        init: function () {
          let currentStep = 1,
            totalSteps = 3,
            chartInstance = null,
            lastCalculationData = null;
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
              .forEach((s, i) =>
                s.classList.toggle("active", i + 1 === currentStep)
              );
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
            const architectFees =
              baseConstructionCost * (architectFeePercent / 100);
            const grandTotal =
              baseConstructionCost + permissionFees + architectFees;
            lastCalculationData = {
              grandTotal,
              baseConstructionCost,
              breakdown,
              permissionFees,
              architectFees,
              builtUpArea,
            };
            displayResults(lastCalculationData);
          }

          function displayResults(data) {
            const resultsSection = document.getElementById("results");
            resultsSection.innerHTML = `
                            <header class="results-header"><h2>Your Estimated Budget</h2><button id="downloadPdfBtn" class="btn btn-primary">Download PDF</button></header>
                            <div class="results-card">
                                <div class="results-grid">
                                    <div class="chart-container"><canvas id="costChart"></canvas></div>
                                    <div>
                                        <p>Total Estimated Cost</p><p id="grandTotal">₹${Math.round(
                                          data.grandTotal
                                        ).toLocaleString("en-IN")}</p>
                                        <div class="summary-details">
                                            <div class="summary-item"><span>Base Construction Cost:</span><span>₹${Math.round(
                                              data.baseConstructionCost
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>Architect & Approval Fees:</span><span>₹${Math.round(
                                              data.architectFees +
                                                data.permissionFees
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
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
                                          )}</span><span>₹${Math.round(
                                            value
                                          ).toLocaleString(
                                            "en-IN"
                                          )}</span></div>`
                                      )
                                      .join("")}
                                </div>
                            </div>`;
            resultsSection.classList.remove("hidden");
            document
              .getElementById("downloadPdfBtn")
              .addEventListener("click", generatePDF);
            window.scrollTo({
              top: resultsSection.offsetTop - 20,
              behavior: "smooth",
            });
            const chartLabels = Object.keys(data.breakdown).map((k) =>
              k
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
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

          function generatePDF() {
            if (!lastCalculationData) return;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const data = lastCalculationData;
            const today = new Date().toLocaleDateString("en-IN");
            doc.setFontSize(20);
            doc.text("House Construction Estimation", 105, 20, {
              align: "center",
            });
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${today}`, 105, 28, { align: "center" });
            let y = 45;
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text("Overall Summary", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(12);
            doc.text("Total Estimated Cost:", 20, y);
            doc.text(
              `₹${Math.round(data.grandTotal).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 8;
            doc.text(`Base Cost (${data.builtUpArea} sq.ft.):`, 20, y);
            doc.text(
              `₹${Math.round(data.baseConstructionCost).toLocaleString(
                "en-IN"
              )}`,
              190,
              y,
              { align: "right" }
            );
            y += 8;
            doc.text("Permission Fees:", 20, y);
            doc.text(
              `₹${Math.round(data.permissionFees).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 8;
            doc.text("Architect Fees:", 20, y);
            doc.text(
              `₹${Math.round(data.architectFees).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 15;
            doc.setFontSize(16);
            doc.text("Stage-wise Breakdown", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(10);
            Object.entries(data.breakdown).forEach(([key, value]) => {
              const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());
              doc.text(`- ${label}:`, 20, y);
              doc.text(
                `₹${Math.round(value).toLocaleString("en-IN")}`,
                190,
                y,
                { align: "right" }
              );
              y += 7;
            });
            doc.save(`House-Construction-Estimation-${Date.now()}.pdf`);
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
        },
      },
      painting: {
        init: function () {
          let currentStep = 1,
            totalSteps = 3,
            areas = [],
            chartInstance = null,
            lastCalculationData = null;
          const costData = {
            paintPerLitre: { basic: 250, premium: 450, luxury: 700 },
            coverageSqFtPerLitre: { basic: 130, premium: 150, luxury: 160 },
            puttyPerKg: 20,
            puttyCoverageSqFtPerKg: 15, // for 2 coats
          };

          function updateStepVisibility() {
            document
              .querySelectorAll(".step")
              .forEach((s, i) =>
                s.classList.toggle("active", i + 1 === currentStep)
              );
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
              color: "#e5e7eb",
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
            lastCalculationData = {
              grandTotal,
              totalMaterialCost,
              totalLaborCost,
              totalArea,
              paintCost,
              puttyCost,
              paintingLaborCost,
              puttyLaborCost,
              areas,
            };
            displayResults(lastCalculationData);
          }

          function displayResults(data) {
            const resultsSection = document.getElementById("results");
            resultsSection.innerHTML = `
                                <header class="results-header"><h2>Your Estimated Budget</h2><button id="downloadPdfBtn" class="btn btn-primary">Download PDF</button></header>
                                <div class="results-card">
                                    <div class="results-grid">
                                        <div class="chart-container"><canvas id="costChart"></canvas></div>
                                        <div>
                                            <p>Total Estimated Cost</p><p id="grandTotal">₹${Math.round(
                                              data.grandTotal
                                            ).toLocaleString("en-IN")}</p>
                                            <div class="summary-details">
                                                <div class="summary-item"><span>Material Cost:</span><span>₹${Math.round(
                                                  data.totalMaterialCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
                                                <div class="summary-item"><span>Labor Cost:</span><span>₹${Math.round(
                                                  data.totalLaborCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
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
            document
              .getElementById("downloadPdfBtn")
              .addEventListener("click", generatePDF);
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

          function generatePDF() {
            if (!lastCalculationData) return;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const data = lastCalculationData;
            const today = new Date().toLocaleDateString("en-IN");
            doc.setFontSize(20);
            doc.text("Paint Project Estimation", 105, 20, { align: "center" });
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${today}`, 105, 28, { align: "center" });
            let y = 45;
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text("Summary", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(12);
            doc.text("Total Cost:", 20, y);
            doc.text(
              `₹${Math.round(data.grandTotal).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 8;
            doc.text("Material Cost:", 20, y);
            doc.text(
              `₹${Math.round(data.totalMaterialCost).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 8;
            doc.text("Labor Cost:", 20, y);
            doc.text(
              `₹${Math.round(data.totalLaborCost).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 15;
            doc.setFontSize(16);
            doc.text("Areas to be Painted", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(10);
            data.areas.forEach((area) => {
              doc.setFillColor(area.color);
              doc.rect(20, y - 4, 5, 5, "F");
              doc.setTextColor(0);
              doc.text(
                `- ${area.name}: ${area.length}' x ${area.height}' = ${(
                  area.length * area.height
                ).toFixed(2)} sq.ft.`,
                30,
                y
              );
              y += 7;
            });
            doc.save(`Paint-Estimation-${Date.now()}.pdf`);
          }

          document
            .getElementById("addAreaBtn")
            .addEventListener("click", addArea);
          document
            .getElementById("areas-container")
            .addEventListener("change", (e) => {
              if (e.target.matches(".area-input"))
                updateArea(
                  e.target.dataset.id,
                  e.target.dataset.prop,
                  e.target.value
                );
            });
          document
            .getElementById("areas-container")
            .addEventListener("click", (e) => {
              if (e.target.matches(".remove-item-btn")) {
                e.preventDefault();
                areas = areas.filter((a) => a.id !== e.target.dataset.id);
                renderAreas();
              }
            });
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

          addArea();
          updateStepVisibility();
        },
      },
      electrical: {
        init: function () {
          let currentStep = 1,
            totalSteps = 4,
            rooms = [],
            chartInstance = null,
            lastCalculationData = null;
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
                acc.sockets6A +=
                  room.sockets6A * costData.items.socket6A[quality];
                acc.sockets16A +=
                  room.sockets16A * costData.items.socket16A[quality];
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
            const totalMaterialCost =
              totalPointMaterialCost + commonMaterialCost;
            const totalLaborCost = totalPoints * laborPerPoint + mainPanelLabor;
            const grandTotal = totalMaterialCost + totalLaborCost;
            lastCalculationData = {
              grandTotal,
              totalMaterialCost,
              totalLaborCost,
              totalPoints,
              pointCosts,
              commonMaterialCost,
              houseArea,
            };
            displayResults(lastCalculationData);
          }

          function displayResults(data) {
            const resultsSection = document.getElementById("results");
            resultsSection.innerHTML = `
                                <header class="results-header"><h2>Your Estimated Budget</h2><button id="downloadPdfBtn" class="btn btn-primary">Download PDF</button></header>
                                <div class="results-card">
                                    <div class="results-grid">
                                        <div class="chart-container"><canvas id="costChart"></canvas></div>
                                        <div>
                                            <p>Total Estimated Cost</p><p id="grandTotal">₹${Math.round(
                                              data.grandTotal
                                            ).toLocaleString("en-IN")}</p>
                                            <div class="summary-details">
                                                <div class="summary-item"><span>Total Material Cost:</span><span id="totalMaterialCost">₹${Math.round(
                                                  data.totalMaterialCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
                                                <div class="summary-item"><span>Total Labor Cost:</span><span id="totalLaborCost">₹${Math.round(
                                                  data.totalLaborCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
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
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>Fan Points Cost:</span> <span>₹${Math.round(
                                              data.pointCosts.fans
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>6A Socket Points Cost:</span> <span>₹${Math.round(
                                              data.pointCosts.sockets6A
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>16A Socket Points Cost:</span> <span>₹${Math.round(
                                              data.pointCosts.sockets16A
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>AC & TV Points Cost:</span> <span>₹${Math.round(
                                              data.pointCosts.acs +
                                                data.pointCosts.tvs
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item summary-item-total"><span>Pipes, Wires, DB etc. (based on ${
                                              data.houseArea
                                            } sq.ft.):</span> <span>₹${Math.round(
              data.commonMaterialCost
            ).toLocaleString("en-IN")}</span></div>
                                        </div>
                                    </div>
                                </div>`;
            resultsSection.classList.remove("hidden");
            document
              .getElementById("downloadPdfBtn")
              .addEventListener("click", generatePDF);
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

          function generatePDF() {
            if (!lastCalculationData) return;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const data = lastCalculationData;
            const today = new Date().toLocaleDateString("en-IN");
            doc.setFontSize(20);
            doc.text("Electrical Budget Estimation", 105, 20, {
              align: "center",
            });
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${today}`, 105, 28, { align: "center" });
            let yPos = 45;
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text("Cost Summary", 20, yPos);
            doc.setLineWidth(0.5);
            doc.line(20, yPos + 2, 190, yPos + 2);
            yPos += 12;
            doc.setFontSize(12);
            doc.text(`Total Estimated Cost:`, 20, yPos);
            doc.text(
              `₹${Math.round(data.grandTotal).toLocaleString("en-IN")}`,
              190,
              yPos,
              { align: "right" }
            );
            yPos += 10;
            doc.text(`Total Material Cost:`, 20, yPos);
            doc.text(
              `₹${Math.round(data.totalMaterialCost).toLocaleString("en-IN")}`,
              190,
              yPos,
              { align: "right" }
            );
            yPos += 10;
            doc.text(`Total Labor Cost:`, 20, yPos);
            doc.text(
              `₹${Math.round(data.totalLaborCost).toLocaleString("en-IN")}`,
              190,
              yPos,
              { align: "right" }
            );
            yPos += 10;
            doc.text(`Total Electrical Points:`, 20, yPos);
            doc.text(`${data.totalPoints}`, 190, yPos, { align: "right" });
            yPos += 20;
            doc.setFontSize(16);
            doc.text("Room Configuration", 20, yPos);
            doc.line(20, yPos + 2, 190, yPos + 2);
            yPos += 12;
            doc.setFontSize(12);
            const roomSummary = rooms.reduce((acc, room) => {
              acc[room.type] = (acc[room.type] || 0) + 1;
              return acc;
            }, {});
            for (const [roomType, count] of Object.entries(roomSummary)) {
              doc.text(`${count} x ${roomType}`, 20, yPos);
              yPos += 7;
            }
            yPos += 10;
            doc.setFontSize(16);
            doc.text("Material Cost Breakdown", 20, yPos);
            doc.line(20, yPos + 2, 190, yPos + 2);
            yPos += 12;
            doc.setFontSize(12);
            const breakdownItems = [
              { label: "Light Points Cost:", value: data.pointCosts.lights },
              { label: "Fan Points Cost:", value: data.pointCosts.fans },
              {
                label: "6A Socket Points Cost:",
                value: data.pointCosts.sockets6A,
              },
              {
                label: "16A Socket Points Cost:",
                value: data.pointCosts.sockets16A,
              },
              {
                label: "AC & TV Points Cost:",
                value: data.pointCosts.acs + data.pointCosts.tvs,
              },
              {
                label: `Pipes, Wires, DB etc. (for ${data.houseArea} sq.ft.):`,
                value: data.commonMaterialCost,
              },
            ];
            breakdownItems.forEach((item) => {
              doc.text(item.label, 20, yPos);
              doc.text(
                `₹${Math.round(item.value).toLocaleString("en-IN")}`,
                190,
                yPos,
                { align: "right" }
              );
              yPos += 7;
            });
            doc.save(`Electrical-Estimation-${Date.now()}.pdf`);
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
        },
      },
      plumbing: {
        init: function () {
          let currentStep = 1,
            totalSteps = 3,
            fixtureSets = [],
            chartInstance = null,
            lastCalculationData = null;
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
              .forEach((s, i) =>
                s.classList.toggle("active", i + 1 === currentStep)
              );
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
            const fixtureContainer =
              document.getElementById("fixture-container");
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
              kitchenSink:
                totals.kitchenSink * costData.perPoint.kitchenSink[quality],
              geyser: totals.geyser * costData.perPoint.geyser[quality],
            };
            const totalFixtureMaterialCost = Object.values(pointCosts).reduce(
              (sum, cost) => sum + cost,
              0
            );
            const commonMaterialCost =
              houseArea * costData.commonMaterialsPerSqFt[quality];
            const totalMaterialCost =
              totalFixtureMaterialCost + commonMaterialCost;
            const totalPoints = Object.values(totals).reduce(
              (sum, count) => sum + count,
              0
            );
            const totalLaborCost = totalPoints * laborPerPoint + mainlineLabor;
            const grandTotal = totalMaterialCost + totalLaborCost;
            lastCalculationData = {
              grandTotal,
              totalMaterialCost,
              totalLaborCost,
              totalPoints,
              pointCosts,
              commonMaterialCost,
              houseArea,
              fixtureSets,
            };
            displayResults(lastCalculationData);
          }

          function displayResults(data) {
            const resultsSection = document.getElementById("results");
            resultsSection.innerHTML = `
                                 <header class="results-header"><h2>Your Estimated Budget</h2><button id="downloadPdfBtn" class="btn btn-primary">Download PDF</button></header>
                                <div class="results-card">
                                    <div class="results-grid">
                                        <div class="chart-container"><canvas id="costChart"></canvas></div>
                                        <div>
                                            <p>Total Estimated Cost</p><p id="grandTotal">₹${Math.round(
                                              data.grandTotal
                                            ).toLocaleString("en-IN")}</p>
                                            <div class="summary-details">
                                                <div class="summary-item"><span>Total Material Cost:</span><span id="totalMaterialCost">₹${Math.round(
                                                  data.totalMaterialCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
                                                <div class="summary-item"><span>Total Labor Cost:</span><span id="totalLaborCost">₹${Math.round(
                                                  data.totalLaborCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
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
                                              Object.values(
                                                data.pointCosts
                                              ).reduce((s, c) => s + c, 0)
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>Main Pipes & Drainage:</span> <span>₹${Math.round(
                                              data.commonMaterialCost
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item" style="margin-top:0.5rem; border-top:1px solid #eee; padding-top:0.5rem;"><span>Total Labor Cost:</span> <span>₹${Math.round(
                                              data.totalLaborCost
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                        </div>
                                    </div>
                                </div>`;
            resultsSection.classList.remove("hidden");
            document
              .getElementById("downloadPdfBtn")
              .addEventListener("click", generatePDF);
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

          function generatePDF() {
            if (!lastCalculationData) return;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const data = lastCalculationData;
            const today = new Date().toLocaleDateString("en-IN");
            doc.setFontSize(20);
            doc.text("Plumbing Budget Estimation", 105, 20, {
              align: "center",
            });
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${today}`, 105, 28, { align: "center" });
            let y = 45;
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text("Cost Summary", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            const summaryItems = [
              { label: "Total Estimated Cost:", value: data.grandTotal },
              { label: "Total Material Cost:", value: data.totalMaterialCost },
              { label: "Total Labor Cost:", value: data.totalLaborCost },
            ];
            doc.setFontSize(12);
            summaryItems.forEach((item) => {
              doc.text(item.label, 20, y);
              doc.text(
                `₹${Math.round(item.value).toLocaleString("en-IN")}`,
                190,
                y,
                { align: "right" }
              );
              y += 8;
            });
            doc.text(`Total Fixture Points:`, 20, y);
            doc.text(`${data.totalPoints}`, 190, y, { align: "right" });
            y += 15;
            doc.setFontSize(16);
            doc.text("Fixture Details", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(10);
            data.fixtureSets.forEach((set) => {
              const points = [
                "wc",
                "basin",
                "shower",
                "tap",
                "kitchenSink",
                "geyser",
              ]
                .map((p) => (set[p] > 0 ? `${set[p]} ${p}` : ""))
                .filter(Boolean)
                .join(", ");
              doc.text(`- ${set.name}: ${points}`, 20, y);
              y += 7;
            });
            y += 8;
            doc.setFontSize(16);
            doc.text("Cost Breakdown", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(12);
            const breakdownItems = [
              {
                label: "Sanitary & CP Fittings:",
                value: Object.values(data.pointCosts).reduce(
                  (s, c) => s + c,
                  0
                ),
              },
              {
                label: `Main Pipes (for ${data.houseArea} sq.ft.):`,
                value: data.commonMaterialCost,
              },
              { label: "Total Labor:", value: data.totalLaborCost },
            ];
            breakdownItems.forEach((item) => {
              doc.text(item.label, 20, y);
              doc.text(
                `₹${Math.round(item.value).toLocaleString("en-IN")}`,
                190,
                y,
                { align: "right" }
              );
              y += 8;
            });
            doc.save(`Plumbing-Estimation-${Date.now()}.pdf`);
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
        },
      },
      flooring: {
        init: function () {
          let currentStep = 1,
            totalSteps = 3,
            areas = [],
            chartInstance = null,
            lastCalculationData = null;
          const costData = {
            tilePerSqFt: { economy: 40, mid: 75, premium: 120 },
            adhesivePerSqFt: { economy: 15, mid: 25, premium: 40 },
            skirtingTilePerRft: { economy: 25, mid: 40, premium: 60 },
          };

          function updateStepVisibility() {
            document
              .querySelectorAll(".step")
              .forEach((s, i) =>
                s.classList.toggle("active", i + 1 === currentStep)
              );
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
            const name =
              areaNameInput.value.trim() || `Area ${areas.length + 1}`;
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
            const totalMaterialCost =
              tileCost + adhesiveCost + skirtingMaterialCost;
            const tilingLaborCost = totalArea * tilingLabor;
            const skirtingLaborCost = totalSkirtingRft * skirtingLabor;
            const hackingLaborCost = totalArea * hackingLabor;
            const totalLaborCost =
              tilingLaborCost + skirtingLaborCost + hackingLaborCost;
            const grandTotal = totalMaterialCost + totalLaborCost;
            lastCalculationData = {
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
              areas,
              totalSkirtingRft,
            };
            displayResults(lastCalculationData);
          }

          function displayResults(data) {
            const resultsSection = document.getElementById("results");
            resultsSection.innerHTML = `
                                 <header class="results-header"><h2>Your Estimated Budget</h2><button id="downloadPdfBtn" class="btn btn-primary">Download PDF</button></header>
                                <div class="results-card">
                                    <div class="results-grid">
                                        <div class="chart-container"><canvas id="costChart"></canvas></div>
                                        <div>
                                            <p>Total Estimated Cost</p><p id="grandTotal">₹${Math.round(
                                              data.grandTotal
                                            ).toLocaleString("en-IN")}</p>
                                            <div class="summary-details">
                                                <div class="summary-item"><span>Total Material Cost:</span><span id="totalMaterialCost">₹${Math.round(
                                                  data.totalMaterialCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
                                                <div class="summary-item"><span>Total Labor Cost:</span><span id="totalLaborCost">₹${Math.round(
                                                  data.totalLaborCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
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
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>Adhesive, Grout etc.:</span> <span>₹${Math.round(
                                              data.adhesiveCost
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>Skirting Material Cost:</span> <span>₹${Math.round(
                                              data.skirtingMaterialCost
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item" style="margin-top:0.5rem; border-top:1px solid #eee; padding-top:0.5rem;"><span>Tiling Labor Cost:</span> <span>₹${Math.round(
                                              data.tilingLaborCost
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>Skirting Labor Cost:</span> <span>₹${Math.round(
                                              data.skirtingLaborCost
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                            <div class="summary-item"><span>Hacking / Removal Cost:</span> <span>₹${Math.round(
                                              data.hackingLaborCost
                                            ).toLocaleString(
                                              "en-IN"
                                            )}</span></div>
                                        </div>
                                    </div>
                                </div>`;
            resultsSection.classList.remove("hidden");
            document
              .getElementById("downloadPdfBtn")
              .addEventListener("click", generatePDF);
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

          function generatePDF() {
            if (!lastCalculationData) return;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const data = lastCalculationData;
            const today = new Date().toLocaleDateString("en-IN");
            doc.setFontSize(20);
            doc.text("Tile Budget Estimation", 105, 20, { align: "center" });
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${today}`, 105, 28, { align: "center" });
            let y = 45;
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text("Cost Summary", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            const summaryItems = [
              { label: "Total Estimated Cost:", value: data.grandTotal },
              { label: "Total Material Cost:", value: data.totalMaterialCost },
              { label: "Total Labor Cost:", value: data.totalLaborCost },
            ];
            doc.setFontSize(12);
            summaryItems.forEach((item) => {
              doc.text(item.label, 20, y);
              doc.text(
                `₹${Math.round(item.value).toLocaleString("en-IN")}`,
                190,
                y,
                { align: "right" }
              );
              y += 8;
            });
            doc.text(`Total Area:`, 20, y);
            doc.text(`${data.totalArea.toFixed(2)} sq.ft.`, 190, y, {
              align: "right",
            });
            y += 15;
            doc.setFontSize(16);
            doc.text("Area Details", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(10);
            data.areas.forEach((area) => {
              const areaSqFt = area.length * area.width;
              doc.text(
                `- ${area.name}: ${area.length}' x ${
                  area.width
                }' = ${areaSqFt.toFixed(2)} sq.ft. (Skirting: ${
                  area.skirtingRft
                } rft)`,
                20,
                y
              );
              y += 7;
            });
            y += 8;
            doc.setFontSize(16);
            doc.text("Cost Breakdown", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(12);
            const breakdownItems = [
              { label: "Tile Cost:", value: data.tileCost },
              { label: "Adhesive & Grout:", value: data.adhesiveCost },
              { label: "Skirting Material:", value: data.skirtingMaterialCost },
              { label: "Tiling Labor:", value: data.tilingLaborCost },
              { label: "Skirting Labor:", value: data.skirtingLaborCost },
              { label: "Hacking/Removal:", value: data.hackingLaborCost },
            ];
            breakdownItems.forEach((item) => {
              doc.text(item.label, 20, y);
              doc.text(
                `₹${Math.round(item.value).toLocaleString("en-IN")}`,
                190,
                y,
                { align: "right" }
              );
              y += 8;
            });
            doc.save(`Tile-Estimation-${Date.now()}.pdf`);
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
              updateArea(
                e.target.dataset.id,
                e.target.dataset.prop,
                e.target.value
              );
          });
          areaContainer.addEventListener("click", (e) => {
            if (e.target.matches(".remove-item-btn"))
              removeArea(e.target.dataset.id);
          });
          addArea();
          updateStepVisibility();
        },
      },
      doorsAndWindows: {
        init: function () {
          let currentStep = 1,
            totalSteps = 3,
            openings = [],
            chartInstance = null,
            lastCalculationData = null;
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
              .forEach((s, i) =>
                s.classList.toggle("active", i + 1 === currentStep)
              );
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
            const name =
              nameInput.value.trim() || `Opening ${openings.length + 1}`;
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
            const openingsContainer =
              document.getElementById("openings-container");
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
            if (openings.length > 0)
              drawVisualizer(openings[openings.length - 1]);
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
            const brandColor = rootStyles
              .getPropertyValue("--brand-color")
              .trim();
            const textColor = rootStyles
              .getPropertyValue("--text-primary")
              .trim();
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
              parseFloat(document.getElementById("installationLabor").value) ||
              0;
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
              breakdown += `<div class="summary-item"><span>${op.name} (${
                op.width
              }'x${op.height}')</span> <span>₹${Math.round(
                itemTotal
              ).toLocaleString("en-IN")}</span></div>`;
            });
            const grandTotal = totalMaterialCost + totalLaborCost;
            lastCalculationData = {
              grandTotal,
              totalMaterialCost,
              totalLaborCost,
              openings,
              breakdown,
            };
            displayResults(lastCalculationData);
          }

          function displayResults(data) {
            const resultsSection = document.getElementById("results");
            resultsSection.innerHTML = `
                                <header class="results-header"><h2>Your Estimated Budget</h2><button id="downloadPdfBtn" class="btn btn-primary">Download PDF</button></header>
                                <div class="results-card">
                                    <div class="results-grid">
                                        <div class="chart-container"><canvas id="costChart"></canvas></div>
                                        <div>
                                            <p>Total Estimated Cost</p><p id="grandTotal">₹${Math.round(
                                              data.grandTotal
                                            ).toLocaleString("en-IN")}</p>
                                            <div class="summary-details">
                                                <div class="summary-item"><span>Total Material Cost:</span><span id="totalMaterialCost">₹${Math.round(
                                                  data.totalMaterialCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
                                                <div class="summary-item"><span>Total Labor Cost:</span><span id="totalLaborCost">₹${Math.round(
                                                  data.totalLaborCost
                                                ).toLocaleString(
                                                  "en-IN"
                                                )}</span></div>
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
            document
              .getElementById("downloadPdfBtn")
              .addEventListener("click", generatePDF);
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

          function generatePDF() {
            if (!lastCalculationData) return;
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const data = lastCalculationData;
            const today = new Date().toLocaleDateString("en-IN");
            doc.setFontSize(20);
            doc.text("Doors & Windows Estimation", 105, 20, {
              align: "center",
            });
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${today}`, 105, 28, { align: "center" });
            let y = 45;
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text("Cost Summary", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(12);
            doc.text("Total Estimated Cost:", 20, y);
            doc.text(
              `₹${Math.round(data.grandTotal).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 8;
            doc.text("Total Material Cost:", 20, y);
            doc.text(
              `₹${Math.round(data.totalMaterialCost).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 8;
            doc.text("Total Labor Cost:", 20, y);
            doc.text(
              `₹${Math.round(data.totalLaborCost).toLocaleString("en-IN")}`,
              190,
              y,
              { align: "right" }
            );
            y += 15;
            doc.setFontSize(16);
            doc.text("Openings Breakdown", 20, y);
            doc.line(20, y + 2, 190, y + 2);
            y += 12;
            doc.setFontSize(10);
            data.openings.forEach((op) => {
              const area = op.width * op.height;
              doc.text(
                `- ${op.name}: ${op.width}' x ${op.height}' (${area.toFixed(
                  2
                )} sq.ft.)`,
                20,
                y
              );
              y += 7;
            });
            doc.save(`Doors-Windows-Estimation-${Date.now()}.pdf`);
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
            .getElementById("dwForm")
            .addEventListener("submit", calculateBudget);
          const openingsContainer =
            document.getElementById("openings-container");
          document
            .getElementById("addOpeningBtn")
            .addEventListener("click", addOpening);
          openingsContainer.addEventListener("change", (e) => {
            if (e.target.matches(".opening-input"))
              updateOpening(
                e.target.dataset.id,
                e.target.dataset.prop,
                e.target.value
              );
          });
          openingsContainer.addEventListener("click", (e) => {
            if (e.target.matches(".remove-item-btn"))
              removeOpening(e.target.dataset.id);
          });

          addOpening();
          updateStepVisibility();
        },
      },
    },
    loadView: function (pageName) {
      if (this.templates[pageName]) {
        appContainer.innerHTML = this.templates[pageName];
        if (
          this.calculators[pageName] &&
          typeof this.calculators[pageName].init === "function"
        ) {
          this.calculators[pageName].init();
        }
        this.updateNav(pageName);
      } else {
        fetch(`/${pageName}.html`)
          .then((response) =>
            response.ok ? response.text() : Promise.reject("Page not found")
          )
          .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            appContainer.innerHTML = doc.querySelector("main").innerHTML;
            this.updateNav(pageName);
          })
          .catch((err) => {
            console.error("Failed to fetch page: ", err);
            appContainer.innerHTML = `<p>Error: Page not found.</p>`;
          });
      }
    },
    updateNav: function (pageName) {
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === pageName);
      });
    },
    init: function () {
      document.body.addEventListener("click", (e) => {
        const navLink = e.target.closest(".nav-btn, .calculator-link");
        if (navLink && navLink.dataset.page) {
          e.preventDefault();
          this.loadView(navLink.dataset.page);
        }
      });
      // Initial load
      this.loadView("home");
    },
  };

  app.init();
});
