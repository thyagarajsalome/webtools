// House construction calculator

document.addEventListener('DOMContentLoaded', function () {
  // Calculate total cost for Labour and Material Contract
  const area1 = document.getElementById('area-1');
  const quality1 = document.getElementById('quality-1');
  const totalCost1 = document.getElementById('total-cost-1');
  const floors1 = document.getElementById('floors-1');
  const totalCostFloors1 = document.getElementById('total-cost-floors-1');

  area1.addEventListener('input', calculateTotalCost1);
  quality1.addEventListener('change', calculateTotalCost1);
  floors1.addEventListener('change', calculateTotalCostWithFloors1);

  function calculateTotalCost1() {
      const areaValue = parseFloat(area1.value) || 0;
      const qualityValue = parseFloat(quality1.value) || 0;
      const total = areaValue * qualityValue;
      totalCost1.value = total;
      calculateTotalCostWithFloors1();
  }

  function calculateTotalCostWithFloors1() {
      const floorsValue = parseFloat(floors1.value) || 1;
      const totalWithFloors = (parseFloat(totalCost1.value) || 0) * floorsValue;
      totalCostFloors1.value = totalWithFloors;
      calculateOverallTotals();
  }

  // Calculate total cost for Labour Contract
  const area2 = document.getElementById('area-2');
  const quality2 = document.getElementById('quality-2');
  const totalCost2 = document.getElementById('total-cost-2');
  const floors2 = document.getElementById('floors-2');
  const totalCostFloors2 = document.getElementById('total-cost-floors-2');

  area2.addEventListener('input', calculateTotalCost2);
  quality2.addEventListener('change', calculateTotalCost2);
  floors2.addEventListener('change', calculateTotalCostWithFloors2);

  function calculateTotalCost2() {
      const areaValue = parseFloat(area2.value) || 0;
      const qualityValue = parseFloat(quality2.value) || 0;
      const total = areaValue * qualityValue;
      totalCost2.value = total;
      calculateTotalCostWithFloors2();
  }

  function calculateTotalCostWithFloors2() {
      const floorsValue = parseFloat(floors2.value) || 1;
      const totalWithFloors = (parseFloat(totalCost2.value) || 0) * floorsValue;
      totalCostFloors2.value = totalWithFloors;
      calculateOverallTotals();
  }

  // Calculate overall totals
  function calculateOverallTotals() {
      const totalEstimation = parseFloat(totalCostFloors1.value) || 0;
      const totalLabourEstimation = parseFloat(totalCostFloors2.value) || 0;
      document.getElementById('total-estimation').textContent = totalEstimation;
      document.getElementById('total-labour-estimation').textContent = totalLabourEstimation;
  }

  // Clear all data
  document.getElementById('clear-all').addEventListener('click', function () {
      area1.value = '';
      quality1.selectedIndex = 0;
      totalCost1.value = '';
      floors1.selectedIndex = 0;
      totalCostFloors1.value = '';

      area2.value = '';
      quality2.selectedIndex = 0;
      totalCost2.value = '';
      floors2.selectedIndex = 0;
      totalCostFloors2.value = '';

      calculateOverallTotals();
  });

  // Add to list (Download PDF)
  document.getElementById('add-to-list').addEventListener('click', function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.text('House Construction Estimation Calculator', 20, 10);
      doc.text('Labour and Material Contract:', 20, 20);

      doc.autoTable({
          startY: 30,
          head: [['Type of Construction', 'Area in sqft', 'Quality', 'Total cost in Rs', 'Floors', 'Total cost with Floors']],
          body: [
              [
                  document.getElementById('type-construction-1').value,
                  area1.value,
                  quality1.options[quality1.selectedIndex].text,
                  totalCost1.value,
                  floors1.options[floors1.selectedIndex].text,
                  totalCostFloors1.value
              ]
          ]
      });

      doc.text('Total Labour and Material Estimation: Rs ' + document.getElementById('total-estimation').textContent, 20, doc.autoTable.previous.finalY + 10);

      doc.text('Labour Contract:', 20, doc.autoTable.previous.finalY + 20);

      doc.autoTable({
          startY: doc.autoTable.previous.finalY + 30,
          head: [['Type of Construction', 'Area in sqft', 'Quality', 'Total cost in Rs', 'Floors', 'Total cost with Floors']],
          body: [
              [
                  document.getElementById('type-construction-2').value,
                  area2.value,
                  quality2.options[quality2.selectedIndex].text,
                  totalCost2.value,
                  floors2.options[floors2.selectedIndex].text,
                  totalCostFloors2.value
              ]
          ]
      });

      doc.text('Total Labour Cost Estimation: Rs ' + document.getElementById('total-labour-estimation').textContent, 20, doc.autoTable.previous.finalY + 10);

      doc.save('construction-estimation.pdf');
  });

  calculateOverallTotals();
});
