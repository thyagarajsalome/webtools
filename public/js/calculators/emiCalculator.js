
// js/calculators/emiCalculator.js

export const template = `
<div class="calculator-header">
    <h1>House Loan EMI Calculator</h1>
    <p>Estimate your Equated Monthly Installment (EMI) for your home loan.</p>
</div>
<form id="emiForm">
    <div class="form-grid">
        <div>
            <label for="loanAmount">Loan Amount (₹)</label>
            <input type="number" id="loanAmount" value="2500000" />
        </div>
        <div>
            <label for="interestRate">Annual Interest Rate (%)</label>
            <input type="number" id="interestRate" value="8.5" step="0.1" />
        </div>
        <div>
            <label for="loanTenure">Loan Tenure (Years)</label>
            <input type="number" id="loanTenure" value="20" />
        </div>
    </div>
    <div class="form-navigation" style="border-top: none; padding-top: 0; justify-content: center;">
        <button type="submit" id="submitBtn" class="btn btn-submit">Calculate EMI</button>
    </div>
</form>
<section id="results" class="hidden"></section>
`;

export const init = function (db, showToast, shareResults, showInstallPrompt) {
  let chartInstance = null;

  function calculateEMI(e) {
    e.preventDefault();
    const principal =
      parseFloat(document.getElementById("loanAmount").value) || 0;
    const annualRate =
      parseFloat(document.getElementById("interestRate").value) || 0;
    const tenureYears =
      parseFloat(document.getElementById("loanTenure").value) || 0;

    if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
      showToast("Please enter valid loan details.");
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const numberOfMonths = tenureYears * 12;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    const totalPayment = emi * numberOfMonths;
    const totalInterest = totalPayment - principal;

    displayResults({
      emi,
      principal,
      totalInterest,
      totalPayment,
      // Data for saving
      inputs: {
        principal,
        annualRate,
        tenureYears,
      },
    });
  }

  function displayResults(data) {
    const resultsSection = document.getElementById("results");
    resultsSection.innerHTML = `
            <header class="results-header">
                <h2>Your Loan Details</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button id="saveBtn" class="btn btn-secondary">Save Calculation</button>
                    <button id="shareBtn" class="btn btn-primary">Share</button>
                </div>
            </header>
            <div class="results-card" id="results-card">
                <div class="results-grid">
                    <div class="chart-container"><canvas id="costChart"></canvas></div>
                    <div>
                        <p>Monthly EMI</p>
                        <p id="grandTotal">₹${Math.round(
                          data.emi
                        ).toLocaleString("en-IN")}</p>
                        <div class="summary-details">
                            <div class="summary-item"><span>Principal Amount:</span><span>₹${Math.round(
                              data.principal
                            ).toLocaleString("en-IN")}</span></div>
                            <div class="summary-item"><span>Total Interest Paid:</span><span>₹${Math.round(
                              data.totalInterest
                            ).toLocaleString("en-IN")}</span></div>
                            <div class="summary-item summary-item-total"><span>Total Payment:</span><span>₹${Math.round(
                              data.totalPayment
                            ).toLocaleString("en-IN")}</span></div>
                        </div>
                    </div>
                </div>
                <div class="detailed-breakdown-container" style="margin-top: 1.5rem; padding-top: 1.5rem;">
                    <h3 style="margin-bottom: 0.5rem;">EMI Loan Disclaimer</h3>
                    <p style="font-size: 0.875rem; color: var(--text-light); line-height: 1.6;">
                        This EMI calculation is for informational and illustrative purposes only and does not constitute financial advice. The results are based on the inputs provided and do not factor in other possible charges like processing fees. Actual EMI amounts may vary based on the final terms and conditions offered by the lending institution. Please consult with a qualified financial advisor before making any financial decisions.
                    </p>
                </div>
            </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    // Save Button Logic
    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this calculation:",
        "My Home Loan EMI"
      );
      if (name) {
        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "EMI Calculation",
          total: data.emi, // Store EMI as the main 'total'
          data: data, // Save the full data object
          savedOn: new Date().toISOString(),
          tasks: [], // No default tasks for EMI
          expenses: [], // No expenses for EMI
        };
        db.addProject(project);
        showToast("Calculation saved successfully!");
      }
    });

    window.scrollTo({
      top: resultsSection.offsetTop - 20,
      behavior: "smooth",
    });
    renderChart(data.principal, data.totalInterest);
  }

  function renderChart(principal, interest) {
    const ctx = document.getElementById("costChart")?.getContext("2d");
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Principal Paid", "Total Interest"],
        datasets: [
          {
            data: [principal, interest],
            backgroundColor: ["#359EFF", "#ef4444"],
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

  document.getElementById("emiForm").addEventListener("submit", calculateEMI);
};

// js/calculators/emiCalculator.js



export const init = function (db, showToast, shareResults, showInstallPrompt) {
  let chartInstance = null;

  function calculateEMI(e) {
    e.preventDefault();
    const principal =
      parseFloat(document.getElementById("loanAmount").value) || 0;
    const annualRate =
      parseFloat(document.getElementById("interestRate").value) || 0;
    const tenureYears =
      parseFloat(document.getElementById("loanTenure").value) || 0;

    if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
      showToast("Please enter valid loan details.");
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const numberOfMonths = tenureYears * 12;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    const totalPayment = emi * numberOfMonths;
    const totalInterest = totalPayment - principal;

    displayResults({
      emi,
      principal,
      totalInterest,
      totalPayment,
      // Data for saving
      inputs: {
        principal,
        annualRate,
        tenureYears,
      },
    });
  }

  function displayResults(data) {
    const resultsSection = document.getElementById("results");
    resultsSection.innerHTML = `
            <header class="results-header">
                <h2>Your Loan Details</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button id="saveBtn" class="btn btn-secondary">Save Calculation</button>
                    <button id="shareBtn" class="btn btn-primary">Share</button>
                </div>
            </header>
            <div class="results-card" id="results-card">
                <div class="results-grid">
                    <div class="chart-container"><canvas id="costChart"></canvas></div>
                    <div>
                        <p>Monthly EMI</p>
                        <p id="grandTotal">₹${Math.round(
                          data.emi
                        ).toLocaleString("en-IN")}</p>
                        <div class="summary-details">
                            <div class="summary-item"><span>Principal Amount:</span><span>₹${Math.round(
                              data.principal
                            ).toLocaleString("en-IN")}</span></div>
                            <div class="summary-item"><span>Total Interest Paid:</span><span>₹${Math.round(
                              data.totalInterest
                            ).toLocaleString("en-IN")}</span></div>
                            <div class="summary-item summary-item-total"><span>Total Payment:</span><span>₹${Math.round(
                              data.totalPayment
                            ).toLocaleString("en-IN")}</span></div>
                        </div>
                    </div>
                </div>
                <div class="detailed-breakdown-container" style="margin-top: 1.5rem; padding-top: 1.5rem;">
                    <h3 style="margin-bottom: 0.5rem;">EMI Loan Disclaimer</h3>
                    <p style="font-size: 0.875rem; color: var(--text-light); line-height: 1.6;">
                        This EMI calculation is for informational and illustrative purposes only and does not constitute financial advice. The results are based on the inputs provided and do not factor in other possible charges like processing fees. Actual EMI amounts may vary based on the final terms and conditions offered by the lending institution. Please consult with a qualified financial advisor before making any financial decisions.
                    </p>
                </div>
            </div>`;
    resultsSection.classList.remove("hidden");
    document.getElementById("shareBtn").addEventListener("click", shareResults);

    // Save Button Logic
    document.getElementById("saveBtn").addEventListener("click", () => {
      const name = prompt(
        "Enter a name for this calculation:",
        "My Home Loan EMI"
      );
      if (name) {
        const project = {
          id: `proj_${Date.now()}`,
          name: name,
          type: "EMI Calculation",
          total: data.emi, // Store EMI as the main 'total'
          data: data, // Save the full data object
          savedOn: new Date().toISOString(),
          tasks: [], // No default tasks for EMI
          expenses: [], // No expenses for EMI
        };
        db.addProject(project);
        showToast("Calculation saved successfully!");
      }
    });

    window.scrollTo({
      top: resultsSection.offsetTop - 20,
      behavior: "smooth",
    });
    renderChart(data.principal, data.totalInterest);
  }

  function renderChart(principal, interest) {
    const ctx = document.getElementById("costChart")?.getContext("2d");
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Principal Paid", "Total Interest"],
        datasets: [
          {
            data: [principal, interest],
            backgroundColor: ["#359EFF", "#ef4444"],
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

  document.getElementById("emiForm").addEventListener("submit", calculateEMI);
};

