// js/calculators/unitConverter.js

export const template = `
<div class="calculator-header">
    <h1>Unit Converter</h1>
    <p>A handy tool for common construction measurements.</p>
</div>
<form id="converterForm" onsubmit="return false;">
    <div class="form-grid" style="grid-template-columns: 1fr;">
        <div>
            <label for="conversionType">Conversion Type</label>
            <select id="conversionType">
                <option value="length">Length</option>
                <option value="area">Area</option>
            </select>
        </div>
    </div>

    <div class="item-card" style="margin-top: 1rem;">
        <div class="form-grid" style="gap: 1rem; align-items: center;">
            <div>
                <label for="fromValue">From</label>
                <input type="number" id="fromValue" value="1" />
            </div>
            <div>
                <label for="fromUnit">Unit</label>
                <select id="fromUnit"></select>
            </div>
        </div>
        
        <div style="text-align: center; font-weight: 600; margin: 1rem 0; font-size: 1.5rem; color: var(--text-light);">=</div>
        
        <div class="form-grid" style="gap: 1rem; align-items: center;">
            <div>
                <label for="toValue">To</label>
              <input type="number" id="toValue" disabled />
            </div>
            <div>
                <label for="toUnit">Unit</label>
                <select id="toUnit"></select>
            </div>
        </div>
    </div>
</form>
`;

export const init = function () {
  // 1. Get references to the HTML elements
  const conversionType = document.getElementById("conversionType");
  const fromValue = document.getElementById("fromValue");
  const fromUnit = document.getElementById("fromUnit");
  const toValue = document.getElementById("toValue");
  const toUnit = document.getElementById("toUnit");

  // 2. Define all conversion factors in one simple object.
  //    The 'key' is the text shown in the dropdown (e.g., "Meter (m)")
  //    The 'value' is its equivalent in the "base unit" (Meters or Square Meters)
  const factors = {
    length: {
      "Meter (m)": 1,
      "Centimeter (cm)": 0.01,
      "Feet (ft)": 0.3048,
      "Inches (in)": 0.0254,
    },
    area: {
      "Square Meter (sqm)": 1,
      "Square Feet (sqft)": 0.092903,
    },
  };

  // 3. This function fills the dropdowns based on "Length" or "Area"
  function populateUnits() {
    const type = conversionType.value; // "length" or "area"
    const options = factors[type]; // Get the right set of factors

    // Clear previous options
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    // Create new <option> elements for each dropdown
    // Object.keys(options) gives us an array like ["Meter (m)", "Centimeter (cm)", ...]
    for (const unitName in options) {
      fromUnit.innerHTML += `<option value="${unitName}">${unitName}</option>`;
      toUnit.innerHTML += `<option value="${unitName}">${unitName}</option>`;
    }

    // Set different default units (e.g., Meter and Feet)
    const unitNames = Object.keys(options);
    fromUnit.value = unitNames[0]; // First unit (e.g., Meter)
    toUnit.value = unitNames[1]; // Second unit (e.g., Centimeter or SqFt)

    // Calculate the conversion with the new default units
    performConversion();
  }

  // 4. This function does the actual math
  function performConversion() {
    const type = conversionType.value; // "length" or "area"
    const valueToConvert = parseFloat(fromValue.value) || 0;

    // Get the selected unit names from the dropdowns
    const fromUnitName = fromUnit.value;
    const toUnitName = toUnit.value;

    // Get the conversion factors from our 'factors' object
    const fromFactor = factors[type][fromUnitName]; // e.g., 0.3048 for Feet
    const toFactor = factors[type][toUnitName]; // e.g., 0.01 for Centimeter

    // --- The Conversion Logic ---
    // 1. Convert the "from" value into the base unit (Meters or SqM)
    //    Example: 10 ft -> 10 * 0.3048 = 3.048 meters
    const valueInBaseUnit = valueToConvert * fromFactor;

    // 2. Convert the base unit value into the "to" unit by dividing
    //    Example: 3.048 meters -> 3.048 / 0.01 = 304.8 centimeters
    const convertedValue = valueInBaseUnit / toFactor;

    // 5. Display the result, rounded to 4 decimal places
    toValue.value = convertedValue.toFixed(4);
  }

  // 5. Set up event listeners to run the conversion automatically

  // When the user changes "Length" vs "Area"
  conversionType.addEventListener("change", populateUnits);

  // When the user types a new number
  fromValue.addEventListener("input", performConversion);

  // When the user changes a unit in either dropdown
  fromUnit.addEventListener("change", performConversion);
  toUnit.addEventListener("change", performConversion);

  // 6. Run the populate function once on page load to set everything up
  populateUnits();
};
