

const roomButtons = document.querySelectorAll(".room-button");
const estimatorForm = document.getElementById("estimatorForm");
const roomTitle = document.getElementById("roomTitle");
const estimationResult = document.getElementById("estimationResult");
const estimationList = document.getElementById("estimationList");
const totalCostDisplay = document.getElementById("totalCostDisplay");
let estimations = [];

roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const room = button.dataset.room;
    roomTitle.textContent = room;
    estimatorForm.style.display = "block";
    estimationResult.innerHTML = "";
  });
});

function calculateEstimation() {
  const room = roomTitle.textContent;
  const tileType = document.getElementById("tileType").value;
  const tileSize = document.getElementById("tileSize").value;
  const area = parseFloat(document.getElementById("area").value);
  const costPerSqFt = parseFloat(document.getElementById("costPerSqFt").value);

  if (isNaN(area) || isNaN(costPerSqFt) || area <= 0 || costPerSqFt <= 0) {
    alert("Please enter valid positive numbers for area and cost.");
    return;
  }

  const totalCost = area * costPerSqFt;

  const result = `
    <div class="estimation-card">
      <div class="estimation-details">
        <h3>Estimation for ${room}</h3>
        <p>Tile Type: ${tileType === "floor" ? "Floor Tile" : "Wall Tile"}</p>
        <p>Tile Size: ${tileSize}'</p>
        <p>Total Area: ${area.toFixed(2)} sq ft</p>
        <p>Cost per sq ft: Rs. ${costPerSqFt.toFixed(2)}</p>
        <p>Total Cost: Rs. ${totalCost.toFixed(2)}</p>
        <div class="estimation-actions">
          <button onclick="addToList('${room}', '${tileType}', '${tileSize}', ${area}, ${costPerSqFt}, ${totalCost})">Add to List</button>
          <button onclick="downloadEstimation('${room}', '${tileType}', '${tileSize}', ${area}, ${costPerSqFt}, ${totalCost})">Download PDF</button>
        </div>
      </div>
    </div>
  `;

  estimationResult.innerHTML = result;
}

function addToList(room, tileType, tileSize, area, costPerSqFt, totalCost) {
  const estimation = { room, tileType, tileSize, area, costPerSqFt, totalCost };
  estimations.push(estimation);
  updateEstimationList();
  calculateTotalEstimation();
  saveEstimationsToLocalStorage();
}

function updateEstimationList() {
  estimationList.innerHTML = estimations
    .map(
      (est, index) => `
        <div class="estimation-item">
          <span>${est.room} - ${est.tileType} (${est.tileSize}): Rs. ${est.totalCost.toFixed(2)}</span>
         
          <button onclick="removeEstimation(${index})">Remove</button>
        </div>
      `
    )
    .join("");
}

function removeEstimation(index) {
  estimations.splice(index, 1);
  updateEstimationList();
  calculateTotalEstimation();
  saveEstimationsToLocalStorage();
}

function editEstimation(index) {
  const est = estimations[index];
  document.getElementById("tileType").value = est.tileType;
  document.getElementById("tileSize").value = est.tileSize;
  document.getElementById("area").value = est.area.toFixed(2);
  document.getElementById("costPerSqFt").value = est.costPerSqFt.toFixed(2);
  roomTitle.textContent = est.room;
  removeEstimation(index);
  estimatorForm.scrollIntoView({ behavior: 'smooth' });
}

function calculateTotalEstimation() {
  const total = estimations.reduce((sum, est) => sum + est.totalCost, 0);
  totalCostDisplay.innerHTML = `<h3>Total Estimation: Rs. ${total.toFixed(2)}</h3>`;
}

function getCurrentDate() {
  return new Date().toLocaleDateString('en-GB');
}

function saveEstimationsToLocalStorage() {
  localStorage.setItem('tileEstimations', JSON.stringify(estimations));
}

function loadEstimationsFromLocalStorage() {
  const savedEstimations = localStorage.getItem('tileEstimations');
  if (savedEstimations) {
    estimations = JSON.parse(savedEstimations);
    updateEstimationList();
    calculateTotalEstimation();
  }
}

function clearAllEstimations() {
  estimations = [];
  updateEstimationList();
  calculateTotalEstimation();
  saveEstimationsToLocalStorage();
}

function downloadEstimation(room, tileType, tileSize, area, costPerSqFt, totalCost) {
  try {
    if (typeof jspdf === 'undefined') {
      throw new Error('jsPDF is not defined. Make sure the library is properly loaded.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set colors
    const primaryColor = '#4285F4';
    const secondaryColor = '#34A853';

    // Add header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Tile Estimation', 105, 20, null, null, 'center');

    // Reset text color and font size
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    // Add estimation details
    let yPos = 50;
    const leftMargin = 20;
    const lineHeight = 10;

    doc.setFontSize(16);
    doc.setTextColor(secondaryColor);
    doc.text(`Estimation for ${room}`, leftMargin, yPos);
    yPos += lineHeight * 2;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${getCurrentDate()}`, leftMargin, yPos);
    yPos += lineHeight * 1.5;

    const details = [
      [`Tile Type:`, `${tileType === "floor" ? "Floor Tile" : "Wall Tile"}`],
      [`Tile Size:`, `${tileSize}`],
      [`Total Area:`, `${area.toFixed(2)} sq ft`],
      [`Cost per sq ft:`, `Rs. ${costPerSqFt.toFixed(2)}`],
      [`Total Cost:`, `Rs. ${totalCost.toFixed(2)}`]
    ];

    details.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, leftMargin, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(value, leftMargin + 50, yPos);
      yPos += lineHeight;
    });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing our services!', 105, 280, null, null, 'center');

    doc.save(`${room}_estimation.pdf`);
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please check the console for details.');
  }
}

function downloadTotalEstimation() {
  try {
    if (typeof jspdf === 'undefined') {
      throw new Error('jsPDF is not defined. Make sure the library is properly loaded.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set colors
    const headerColor = '#4285F4';
    const alternateRowColor = '#f3f3f3';

    // Add header
    doc.setFillColor(headerColor);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Total Tile Estimation', 105, 15, null, null, 'center');

    // Reset text color and font size
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    // Set up table
    const startY = 30;
    const margin = 10;
    const headers = ['No.', 'Room', 'Tile Type', 'Size', 'Area (sq ft)', 'Cost/sq ft (Rs.)', 'Total (Rs.)'];
    const columnWidths = [15, 30, 30, 20, 25, 30, 30];

    // Draw table header
    doc.setFillColor(headerColor);
    doc.rect(margin, startY, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');

    let xOffset = margin;
    headers.forEach((header, index) => {
      doc.text(header, xOffset + 2, startY + 7);
      xOffset += columnWidths[index];
    });

    // Draw table rows
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    let yOffset = startY + 10;

    estimations.forEach((est, index) => {
      // Alternate row background
      if (index % 2 === 1) {
        doc.setFillColor(alternateRowColor);
        doc.rect(margin, yOffset, 190, 10, 'F');
      }

      const row = [
        (index + 1).toString(),
        est.room,
        est.tileType,
        est.tileSize,
        est.area.toFixed(2),
        est.costPerSqFt.toFixed(2),
        est.totalCost.toFixed(2)
      ];

      xOffset = margin;
      row.forEach((cell, cellIndex) => {
        doc.text(cell.toString(), xOffset + 2, yOffset + 7);
        xOffset += columnWidths[cellIndex];
      });

      yOffset += 10;
    });

    // Add total
    const total = estimations.reduce((sum, est) => sum + est.totalCost, 0);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: Rs. ${total.toFixed(2)}`, 170, yOffset + 10);

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated on ' + getCurrentDate(), 105, 285, null, null, 'center');

    doc.save("total_estimation.pdf");
    console.log('Total estimation PDF generated successfully');
  } catch (error) {
    console.error('Error generating total estimation PDF:', error);
    alert('There was an error generating the total estimation PDF. Please check the console for details.');
  }
}

// Load saved estimations when the page loads
window.addEventListener('load', loadEstimationsFromLocalStorage);