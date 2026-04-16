
// This file exports the template and init logic for the Projects page

// --- TEMPLATE 1: The list of all projects ---
export const template = `
<div class="projects-header">
    <h1>My Saved Projects</h1>
</div>
<div id="projects-list-container" class="projects-list">
    </div>
`;

// --- TEMPLATE 2: The detailed view for a single project ---
// This function generates the HTML for the project detail dashboard
function getProjectDetailTemplate(project, budgetCategories) {
  const totalEstimated = project.total;
  const totalActual = project.expenses.reduce((sum, ex) => sum + ex.amount, 0);

  // Calculate total spent for each budget category
  const categoryTotals = {};
  budgetCategories.forEach((cat) => {
    categoryTotals[cat.name] = project.expenses
      .filter((ex) => ex.category === cat.name)
      .reduce((sum, ex) => sum + ex.amount, 0);
  });

  return `
    <div class="project-detail-view">
      <header class="project-detail-header">
        <button id="backToProjectsBtn" class="btn-back" title="Back to projects">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>${project.name}</h1>
      </header>

      <section class="dashboard-section summary-card">
        <h3>Total Budget</h3>
        <p class="summary-total-estimated">Est: ₹${totalEstimated.toLocaleString(
          "en-IN"
        )}</p>
        <p class="summary-total-actual">Spent: ₹${totalActual.toLocaleString(
          "en-IN"
        )}</p>
        <div class="progress-bar-container">
          <div class="progress-bar-actual" style="width: ${Math.min(
            (totalActual / totalEstimated) * 100,
            100
          )}%;"></div>
        </div>
        ${
          totalActual > totalEstimated
            ? `<p class="summary-warning">You are ₹${(
                totalActual - totalEstimated
              ).toLocaleString("en-IN")} over budget!</p>`
            : ""
        }
      </section>

      <section class="dashboard-section">
        <h3>Budget Tracker</h3>
        <div class="budget-tracker-list">
          ${budgetCategories
            .map(
              (cat) => `
            <div class="budget-item">
              <div class="budget-item-header">
                <span>${cat.name}</span>
                <span class="budget-item-est">Est: ₹${cat.amount.toLocaleString(
                  "en-IN"
                )}</span>
              </div>
              <div class="budget-item-body">
                <span class="budget-item-actual">Spent: ₹${categoryTotals[
                  cat.name
                ].toLocaleString("en-IN")}</span>
                <div class="progress-bar-container">
                  <div class="progress-bar-actual" style="width: ${Math.min(
                    (categoryTotals[cat.name] / cat.amount) * 100,
                    100
                  )}%;"></div>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>

      <section class="dashboard-section">
        <h3>Expense Log</h3>
        <div id="expense-list" class="expense-list">
          ${
            project.expenses.length === 0
              ? '<p class="empty-list-text">No expenses added yet.</p>'
              : ""
          }
          ${project.expenses
            .slice()
            .reverse()
            .map(
              (ex) => `
            <div class="expense-item" data-id="${ex.id}">
              <span>${ex.desc}</span>
              <span class="expense-item-amount">₹${ex.amount.toLocaleString(
                "en-IN"
              )} (${ex.category})</span>
              <button class="btn-delete-item" data-id="${
                ex.id
              }">&times;</button>
            </div>
          `
            )
            .join("")}
        </div>
        <form id="add-expense-form" class="add-item-form">
          <input type="text" id="expense-desc" placeholder="Expense description (e.g., Cement)" required>
          <div class="form-grid-half">
            <input type="number" id="expense-amount" placeholder="Amount (₹)" required>
            <select id="expense-category" required>
              ${budgetCategories
                .map(
                  (cat) => `<option value="${cat.name}">${cat.name}</option>`
                )
                .join("")}
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Add Expense</button>
        </form>
      </section>

      <section class="dashboard-section">
        <h3>Project Checklist</h3>
        <div id="checklist-container" class="checklist">
          ${
            project.tasks.length === 0
              ? '<p class="empty-list-text">No tasks added yet.</p>'
              : ""
          }
          ${project.tasks
            .map(
              (task) => `
            <div class="checklist-item" data-id="${task.id}">
              <input type="checkbox" id="task-${task.id}" data-id="${
                task.id
              }" ${task.done ? "checked" : ""}>
              <label for="task-${task.id}" class="${
                task.done ? "task-done" : ""
              }">${task.text}</label>
              <button class="btn-delete-item" data-id="${
                task.id
              }">&times;</button>
            </div>
          `
            )
            .join("")}
        </div>
        <form id="add-task-form" class="add-item-form">
          <input type="text" id="task-text" placeholder="New task (e.g., Finalize plans)" required>
          <button type="submit" class="btn btn-primary">Add Task</button>
        </form>
      </section>

    </div>
  `;
}

// --- Main Init Function ---
export const init = function (db, showToast) {
  const appContainer = document.getElementById("app-container");

  // --- Main Function to Render Project List ---
  function renderProjectList() {
    // Set the container to the list template first
    appContainer.innerHTML = template;
    const projectsListContainer = document.getElementById(
      "projects-list-container"
    );
    if (!projectsListContainer) return;

    const projects = db.getProjects().reverse(); // Show newest first

    if (projects.length === 0) {
      projectsListContainer.innerHTML = `
        <div class="empty-state">
            <span class="material-symbols-outlined">article</span>
            <p>You have no saved projects.</p>
            <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
                Use a calculator and save the result to start a new project.
            </p>
        </div>
      `;
      return;
    }

    // Render projects as cards
    projectsListContainer.innerHTML = projects
      .map((project) => {
        const totalEstimated = project.total;
        const totalActual = (project.expenses || []).reduce(
          (sum, ex) => sum + ex.amount,
          0
        );

        return `
          <div class="project-card-interactive">
            <div class="project-details">
              <h3>${project.name}</h3>
              <p>${project.type} · Saved on ${new Date(
          project.savedOn
        ).toLocaleDateString()}</p>
              <p class="project-total-list">
                <span class="project-total-actual">₹${totalActual.toLocaleString(
                  "en-IN"
                )}</span> / 
                <span class="project-total-est">₹${totalEstimated.toLocaleString(
                  "en-IN"
                )}</span>
              </p>
              <div class="progress-bar-container">
                <div class="progress-bar-actual" style="width: ${Math.min(
                  (totalActual / totalEstimated) * 100,
                  100
                )}%;"></div>
              </div>
            </div>
            <div class="project-card-actions">
              <button class="btn btn-primary btn-view-project" data-id="${
                project.id
              }">View</button>
              <button class="btn-delete" data-id="${
                project.id
              }" title="Delete project">
                  <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // --- Main Function to Render Project Detail Dashboard ---
  function renderProjectDetail(projectId) {
    let project = db.getProject(projectId);
    if (!project) {
      showToast("Error: Project not found.");
      renderProjectList();
      return;
    }

    // --- Initialize new features if they don't exist ---
    if (!project.tasks) {
      project.tasks = [];
    }
    if (!project.expenses) {
      project.expenses = [];
    }

    // --- Standardize the budget categories ---
    // This makes the dashboard compatible with all calculators
    let budgetCategories = [];
    if (project.data.breakdown) {
      // For 'House Construction'
      budgetCategories = Object.keys(project.data.breakdown).map((key) => ({
        name: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        amount: project.data.breakdown[key],
      }));
    } else {
      // For other calculators
      budgetCategories = [
        { name: "Material Cost", amount: project.data.totalMaterialCost || 0 },
        { name: "Labor Cost", amount: project.data.totalLaborCost || 0 },
      ];
    }
    // Add other fees if they exist
    if (project.data.permissionFees) {
      budgetCategories.push({
        name: "Permission Fees",
        amount: project.data.permissionFees,
      });
    }
    if (project.data.architectFees) {
      budgetCategories.push({
        name: "Architect Fees",
        amount: project.data.architectFees,
      });
    }

    // Set the dashboard HTML
    appContainer.innerHTML = getProjectDetailTemplate(
      project,
      budgetCategories
    );

    // --- Add Event Listeners for the Dashboard ---

    // Back button
    document
      .getElementById("backToProjectsBtn")
      .addEventListener("click", () => {
        renderProjectList(); // Re-render the list view
      });

    // Add Expense
    document
      .getElementById("add-expense-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const desc = document.getElementById("expense-desc").value;
        const amount = parseFloat(
          document.getElementById("expense-amount").value
        );
        const category = document.getElementById("expense-category").value;

        if (!desc || !amount || !category) return;

        const newExpense = {
          id: `exp_${Date.now()}`,
          desc,
          amount,
          category,
        };
        project.expenses.push(newExpense);
        db.updateProject(projectId, project);
        renderProjectDetail(projectId); // Re-render the dashboard
      });

    // Add Task
    document.getElementById("add-task-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.getElementById("task-text").value;
      if (!text) return;

      const newTask = {
        id: `task_${Date.now()}`,
        text,
        done: false,
      };
      project.tasks.push(newTask);
      db.updateProject(projectId, project);
      renderProjectDetail(projectId); // Re-render the dashboard
    });

    // Toggle Task (Check/Uncheck)
    appContainer
      .querySelector("#checklist-container")
      .addEventListener("change", (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
          const taskId = e.target.dataset.id;
          const task = project.tasks.find((t) => t.id === taskId);
          if (task) {
            task.done = e.target.checked;
            db.updateProject(projectId, project);
            // Just update the label class, no full re-render needed
            e.target.nextElementSibling.classList.toggle(
              "task-done",
              task.done
            );
          }
        }
      });

    // Delete Task or Expense
    appContainer.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".btn-delete-item");
      if (!deleteBtn) return;

      const id = deleteBtn.dataset.id;
      if (id.startsWith("task_")) {
        project.tasks = project.tasks.filter((t) => t.id !== id);
        db.updateProject(projectId, project);
        renderProjectDetail(projectId); // Re-render
      } else if (id.startsWith("exp_")) {
        project.expenses = project.expenses.filter((ex) => ex.id !== id);
        db.updateProject(projectId, project);
        renderProjectDetail(projectId); // Re-render
      }
    });
  }

  // --- Initial Setup for the 'projects' page ---

  // Add event listeners for the main project list (View and Delete)
  appContainer.addEventListener("click", (e) => {
    // View Project Button
    const viewButton = e.target.closest(".btn-view-project");
    if (viewButton) {
      const projectId = viewButton.dataset.id;
      renderProjectDetail(projectId);
    }

    // Delete Project Button
    const deleteButton = e.target.closest(".btn-delete");
    if (deleteButton) {
      const projectId = deleteButton.dataset.id;
      if (
        confirm(
          "Are you sure you want to delete this project? This cannot be undone."
        )
      ) {
        db.deleteProject(projectId);
        showToast("Project deleted.");
        renderProjectList(); // Re-render the list
      }
    }
  });

  // Initial render of the project list
  renderProjectList();
};

// This file exports the template and init logic for the Projects page

// --- TEMPLATE 1: The list of all projects ---
export const template = `
<div class="projects-header">
    <h1>My Saved Projects</h1>
</div>
<div id="projects-list-container" class="projects-list">
    </div>
`;

// --- TEMPLATE 2: The detailed view for a single project ---
// This function generates the HTML for the project detail dashboard
function getProjectDetailTemplate(project, budgetCategories) {
  const totalEstimated = project.total;
  const totalActual = project.expenses.reduce((sum, ex) => sum + ex.amount, 0);

  // Calculate total spent for each budget category
  const categoryTotals = {};
  budgetCategories.forEach((cat) => {
    categoryTotals[cat.name] = project.expenses
      .filter((ex) => ex.category === cat.name)
      .reduce((sum, ex) => sum + ex.amount, 0);
  });

  return `
    <div class="project-detail-view">
      <header class="project-detail-header">
        <button id="backToProjectsBtn" class="btn-back" title="Back to projects">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>${project.name}</h1>
      </header>

      <section class="dashboard-section summary-card">
        <h3>Total Budget</h3>
        <p class="summary-total-estimated">Est: ₹${totalEstimated.toLocaleString(
          "en-IN"
        )}</p>
        <p class="summary-total-actual">Spent: ₹${totalActual.toLocaleString(
          "en-IN"
        )}</p>
        <div class="progress-bar-container">
          <div class="progress-bar-actual" style="width: ${Math.min(
            (totalActual / totalEstimated) * 100,
            100
          )}%;"></div>
        </div>
        ${
          totalActual > totalEstimated
            ? `<p class="summary-warning">You are ₹${(
                totalActual - totalEstimated
              ).toLocaleString("en-IN")} over budget!</p>`
            : ""
        }
      </section>

      <section class="dashboard-section">
        <h3>Budget Tracker</h3>
        <div class="budget-tracker-list">
          ${budgetCategories
            .map(
              (cat) => `
            <div class="budget-item">
              <div class="budget-item-header">
                <span>${cat.name}</span>
                <span class="budget-item-est">Est: ₹${cat.amount.toLocaleString(
                  "en-IN"
                )}</span>
              </div>
              <div class="budget-item-body">
                <span class="budget-item-actual">Spent: ₹${categoryTotals[
                  cat.name
                ].toLocaleString("en-IN")}</span>
                <div class="progress-bar-container">
                  <div class="progress-bar-actual" style="width: ${Math.min(
                    (categoryTotals[cat.name] / cat.amount) * 100,
                    100
                  )}%;"></div>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>

      <section class="dashboard-section">
        <h3>Expense Log</h3>
        <div id="expense-list" class="expense-list">
          ${
            project.expenses.length === 0
              ? '<p class="empty-list-text">No expenses added yet.</p>'
              : ""
          }
          ${project.expenses
            .slice()
            .reverse()
            .map(
              (ex) => `
            <div class="expense-item" data-id="${ex.id}">
              <span>${ex.desc}</span>
              <span class="expense-item-amount">₹${ex.amount.toLocaleString(
                "en-IN"
              )} (${ex.category})</span>
              <button class="btn-delete-item" data-id="${
                ex.id
              }">&times;</button>
            </div>
          `
            )
            .join("")}
        </div>
        <form id="add-expense-form" class="add-item-form">
          <input type="text" id="expense-desc" placeholder="Expense description (e.g., Cement)" required>
          <div class="form-grid-half">
            <input type="number" id="expense-amount" placeholder="Amount (₹)" required>
            <select id="expense-category" required>
              ${budgetCategories
                .map(
                  (cat) => `<option value="${cat.name}">${cat.name}</option>`
                )
                .join("")}
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Add Expense</button>
        </form>
      </section>

      <section class="dashboard-section">
        <h3>Project Checklist</h3>
        <div id="checklist-container" class="checklist">
          ${
            project.tasks.length === 0
              ? '<p class="empty-list-text">No tasks added yet.</p>'
              : ""
          }
          ${project.tasks
            .map(
              (task) => `
            <div class="checklist-item" data-id="${task.id}">
              <input type="checkbox" id="task-${task.id}" data-id="${
                task.id
              }" ${task.done ? "checked" : ""}>
              <label for="task-${task.id}" class="${
                task.done ? "task-done" : ""
              }">${task.text}</label>
              <button class="btn-delete-item" data-id="${
                task.id
              }">&times;</button>
            </div>
          `
            )
            .join("")}
        </div>
        <form id="add-task-form" class="add-item-form">
          <input type="text" id="task-text" placeholder="New task (e.g., Finalize plans)" required>
          <button type="submit" class="btn btn-primary">Add Task</button>
        </form>
      </section>

    </div>
  `;
}

// --- Main Init Function ---
export const init = function (db, showToast) {
  const appContainer = document.getElementById("app-container");

  // --- Main Function to Render Project List ---
  function renderProjectList() {
    // Set the container to the list template first
    appContainer.innerHTML = template;
    const projectsListContainer = document.getElementById(
      "projects-list-container"
    );
    if (!projectsListContainer) return;

    const projects = db.getProjects().reverse(); // Show newest first

    if (projects.length === 0) {
      projectsListContainer.innerHTML = `
        <div class="empty-state">
            <span class="material-symbols-outlined">article</span>
            <p>You have no saved projects.</p>
            <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
                Use a calculator and save the result to start a new project.
            </p>
        </div>
      `;
      return;
    }

    // Render projects as cards
    projectsListContainer.innerHTML = projects
      .map((project) => {
        const totalEstimated = project.total;
        const totalActual = (project.expenses || []).reduce(
          (sum, ex) => sum + ex.amount,
          0
        );

        return `
          <div class="project-card-interactive">
            <div class="project-details">
              <h3>${project.name}</h3>
              <p>${project.type} · Saved on ${new Date(
          project.savedOn
        ).toLocaleDateString()}</p>
              <p class="project-total-list">
                <span class="project-total-actual">₹${totalActual.toLocaleString(
                  "en-IN"
                )}</span> / 
                <span class="project-total-est">₹${totalEstimated.toLocaleString(
                  "en-IN"
                )}</span>
              </p>
              <div class="progress-bar-container">
                <div class="progress-bar-actual" style="width: ${Math.min(
                  (totalActual / totalEstimated) * 100,
                  100
                )}%;"></div>
              </div>
            </div>
            <div class="project-card-actions">
              <button class="btn btn-primary btn-view-project" data-id="${
                project.id
              }">View</button>
              <button class="btn-delete" data-id="${
                project.id
              }" title="Delete project">
                  <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // --- Main Function to Render Project Detail Dashboard ---
  function renderProjectDetail(projectId) {
    let project = db.getProject(projectId);
    if (!project) {
      showToast("Error: Project not found.");
      renderProjectList();
      return;
    }

    // --- Initialize new features if they don't exist ---
    if (!project.tasks) {
      project.tasks = [];
    }
    if (!project.expenses) {
      project.expenses = [];
    }

    // --- Standardize the budget categories ---
    // This makes the dashboard compatible with all calculators
    let budgetCategories = [];
    if (project.data.breakdown) {
      // For 'House Construction'
      budgetCategories = Object.keys(project.data.breakdown).map((key) => ({
        name: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        amount: project.data.breakdown[key],
      }));
    } else {
      // For other calculators
      budgetCategories = [
        { name: "Material Cost", amount: project.data.totalMaterialCost || 0 },
        { name: "Labor Cost", amount: project.data.totalLaborCost || 0 },
      ];
    }
    // Add other fees if they exist
    if (project.data.permissionFees) {
      budgetCategories.push({
        name: "Permission Fees",
        amount: project.data.permissionFees,
      });
    }
    if (project.data.architectFees) {
      budgetCategories.push({
        name: "Architect Fees",
        amount: project.data.architectFees,
      });
    }

    // Set the dashboard HTML
    appContainer.innerHTML = getProjectDetailTemplate(
      project,
      budgetCategories
    );

    // --- Add Event Listeners for the Dashboard ---

    // Back button
    document
      .getElementById("backToProjectsBtn")
      .addEventListener("click", () => {
        renderProjectList(); // Re-render the list view
      });

    // Add Expense
    document
      .getElementById("add-expense-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const desc = document.getElementById("expense-desc").value;
        const amount = parseFloat(
          document.getElementById("expense-amount").value
        );
        const category = document.getElementById("expense-category").value;

        if (!desc || !amount || !category) return;

        const newExpense = {
          id: `exp_${Date.now()}`,
          desc,
          amount,
          category,
        };
        project.expenses.push(newExpense);
        db.updateProject(projectId, project);
        renderProjectDetail(projectId); // Re-render the dashboard
      });

    // Add Task
    document.getElementById("add-task-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.getElementById("task-text").value;
      if (!text) return;

      const newTask = {
        id: `task_${Date.now()}`,
        text,
        done: false,
      };
      project.tasks.push(newTask);
      db.updateProject(projectId, project);
      renderProjectDetail(projectId); // Re-render the dashboard
    });

    // Toggle Task (Check/Uncheck)
    appContainer
      .querySelector("#checklist-container")
      .addEventListener("change", (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
          const taskId = e.target.dataset.id;
          const task = project.tasks.find((t) => t.id === taskId);
          if (task) {
            task.done = e.target.checked;
            db.updateProject(projectId, project);
            // Just update the label class, no full re-render needed
            e.target.nextElementSibling.classList.toggle(
              "task-done",
              task.done
            );
          }
        }
      });

    // Delete Task or Expense
    appContainer.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".btn-delete-item");
      if (!deleteBtn) return;

      const id = deleteBtn.dataset.id;
      if (id.startsWith("task_")) {
        project.tasks = project.tasks.filter((t) => t.id !== id);
        db.updateProject(projectId, project);
        renderProjectDetail(projectId); // Re-render
      } else if (id.startsWith("exp_")) {
        project.expenses = project.expenses.filter((ex) => ex.id !== id);
        db.updateProject(projectId, project);
        renderProjectDetail(projectId); // Re-render
      }
    });
  }

  // --- Initial Setup for the 'projects' page ---

  // Add event listeners for the main project list (View and Delete)
  appContainer.addEventListener("click", (e) => {
    // View Project Button
    const viewButton = e.target.closest(".btn-view-project");
    if (viewButton) {
      const projectId = viewButton.dataset.id;
      renderProjectDetail(projectId);
    }

    // Delete Project Button
    const deleteButton = e.target.closest(".btn-delete");
    if (deleteButton) {
      const projectId = deleteButton.dataset.id;
      if (
        confirm(
          "Are you sure you want to delete this project? This cannot be undone."
        )
      ) {
        db.deleteProject(projectId);
        showToast("Project deleted.");
        renderProjectList(); // Re-render the list
      }
    }
  });

  // Initial render of the project list
  renderProjectList();
};

