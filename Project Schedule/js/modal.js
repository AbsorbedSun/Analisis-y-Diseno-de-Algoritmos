/**
 * ============================================================================
 * GESTIÓN DE MODALES
 * ============================================================================
 */

function openAddProfessorModal() {
  document.getElementById("professorModal").style.display = "block";
  document.getElementById("profName").value = "";
  document.getElementById("profStartTime").value = "08:00";
  document.getElementById("profEndTime").value = "16:00";
}

function openAddTeamModal() {
  const modal = document.getElementById("teamModal");
  modal.style.display = "block";
  const container = document.getElementById("professorCheckboxes");
  const professors = getAllProfessors();

  if (professors.length === 0) {
    container.innerHTML =
      '<p style="color: #e74c3c; text-align: center; padding: 20px;">No hay profesores disponibles.</p>';
    return;
  }

  let html = "";
  for (let prof of professors) {
    html += '<div class="checkbox-item">';
    html += `<input type="checkbox" id="prof_${prof.name}" value="${prof.name}">`;
    html += `<label for="prof_${prof.name}">${prof.name} (${formatTime(
      prof.startTime
    )} - ${formatTime(prof.endTime)})</label>`;
    html += "</div>";
  }
  container.innerHTML = html;
  document.getElementById("selectionWarning").style.display = "none";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function addProfessor() {
  const name = document.getElementById("profName").value.trim();
  const startTime = timeToMinutes(
    document.getElementById("profStartTime").value
  );
  const endTime = timeToMinutes(document.getElementById("profEndTime").value);

  if (!name) {
    alert("Ingrese el nombre del profesor");
    return;
  }
  if (startTime >= endTime) {
    alert("La hora de inicio debe ser anterior a la hora de fin");
    return;
  }

  try {
    addProfessorToData(name, startTime, endTime);
    displayProfessors();
    closeModal("professorModal");
    showSuccess(`Profesor "${name}" agregado`);
  } catch (error) {
    alert(error.message);
  }
}

function addTeam() {
  const checkboxes = document.querySelectorAll(
    '#professorCheckboxes input[type="checkbox"]:checked'
  );
  const selected = Array.from(checkboxes).map((cb) => cb.value);

  if (selected.length !== 3) {
    document.getElementById("selectionWarning").style.display = "block";
    return;
  }

  try {
    addTeamToData(selected);
    displayTeams();
    closeModal("teamModal");
    showSuccess(`Equipo agregado: ${selected.join(", ")}`);
  } catch (error) {
    alert(error.message);
  }
}

function showSuccess(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #28a745;
        color: white; padding: 15px 25px; border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;
    `;
  document.body.appendChild(notification);
  setTimeout(() => document.body.removeChild(notification), 3000);
}

window.onclick = function (event) {
  const professorModal = document.getElementById("professorModal");
  const teamModal = document.getElementById("teamModal");
  if (event.target === professorModal) closeModal("professorModal");
  if (event.target === teamModal) closeModal("teamModal");
};
