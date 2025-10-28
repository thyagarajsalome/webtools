// This file exports the template and init logic for the Projects page

export const template = `
<div class="projects-header">
    <h1>My Saved Projects</h1>
</div>
<div id="projects-list-container" class="projects-list">
    </div>
`;

export const init = function (db, showToast) {
  const projectsListContainer = document.getElementById(
    "projects-list-container"
  );
  if (!projectsListContainer) return;

  function renderProjects() {
    const projectsListContainer = document.getElementById(
      "projects-list-container"
    );
    const projects = db.getProjects().reverse(); // Show newest first

    if (projects.length === 0) {
      projectsListContainer.innerHTML = `
                    <div class="empty-state">
                        <span class="material-symbols-outlined">article</span>
                        <p>You have no saved projects.</p>
                        <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
                            Try one of the calculators and save the result to see it here.
                        </p>
                    </div>
                `;
      return;
    }

    projectsListContainer.innerHTML = projects
      .map(
        (project) => `
                <div class="project-card">
                    <div class="project-details">
                        <h3>${project.name}</h3>
                        <p>${project.type} · Saved on ${new Date(
          project.savedOn
        ).toLocaleDateString()}</p>
                        <p class="project-total">₹${Math.round(
                          project.total
                        ).toLocaleString("en-IN")}</p>
                    </div>
                    <button class="btn-delete" data-id="${
                      project.id
                    }" title="Delete project">
                        <span class="material-symbols-outlined" style="font-size: 1.25rem;">delete</span>
                    </button>
                </div>
            `
      )
      .join("");
  }

  // Initial render
  renderProjects();

  // Add event listener for delete buttons
  projectsListContainer.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".btn-delete");
    if (deleteButton) {
      const projectId = deleteButton.dataset.id;
      if (confirm("Are you sure you want to delete this saved project?")) {
        db.deleteProject(projectId);
        showToast("Project deleted.");
        renderProjects(); // Re-render the list
      }
    }
  });
};
