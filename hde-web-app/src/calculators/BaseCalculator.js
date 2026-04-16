// src/calculators/BaseCalculator.js
export default class BaseCalculator {
    constructor(name) {
        if (new.target === BaseCalculator) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.calculatorName = name;
        this.DOM = {}; // Stores cached DOM references
    }

    // Must be implemented by subclasses
    collectInputs() { throw new Error("Method 'collectInputs()' must be implemented."); }
    calculate(inputs) { throw new Error("Method 'calculate()' must be implemented."); }
    
    // Standardized result rendering
    renderResults(data) {
        const resultsSection = document.getElementById('results');
        // Lazy load Chart.js only when results are rendered
        import('../utils/performance.js').then(({ loadScript }) => {
            loadScript('https://cdn.jsdelivr.net/npm/chart.js').then(() => {
                this.drawChart(data);
            });
        });
    }

    drawChart(data) {
        // Base chart logic applied to all calculators
    }
}